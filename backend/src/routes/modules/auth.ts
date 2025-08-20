import { Router } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { transporter } from "../../lib/mailer";
import crypto from "crypto";

export const router = Router();

const regSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z
    .string()
    .min(3, { message: "Имя пользователя должно быть не короче 3 символов" })
    .max(30, { message: "Имя пользователя должно быть не длиннее 30 символов" })
    .regex(/^[\p{L}\p{N}_\.\-]+$/u, {
      message: "Допустимы буквы, цифры, подчёркивание, точка и дефис",
    }),
});

router.post("/register", async (req, res) => {
  const parsed = regSchema.safeParse(req.body);
  if (!parsed.success) {
    const first = parsed.error.issues?.[0];
    return res.status(400).json({ message: first?.message || "Некорректные данные" });
  }

  const { email, password, username } = parsed.data as { email: string; password: string; username: string };

  const exist = await prisma.user.findUnique({ where: { email } });
  if (exist) return res.status(409).json({ message: "Email already used" });

  const existUsername = await prisma.user.findUnique({ where: { username } });
  if (existUsername) return res.status(409).json({ message: "Username already used" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, role: "USER", isActive: false, username },
  });

  // generate email verify token
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
  await prisma.emailVerifyToken.create({ data: { token, userId: user.id, expiresAt: expires } });

  const verifyUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: `"Mobilive" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: "Подтверждение email — Mobilive",
    html: `<p>Здравствуйте!</p><p>Для подтверждения email перейдите по ссылке:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p><p>Срок действия ссылки: 24 часа.</p>`,
  });

  return res.status(201).json({ 
    message: "Мы отправили письмо для подтверждения. Проверьте почту.",
    user: { id: user.id, email: user.email, role: user.role, username: user.username }
  });
});

router.get("/verify-email", async (req, res) => {
  const token = (req.query.token as string) || "";
  if (!token) return res.status(400).json({ message: "token required" });
  const record = await prisma.emailVerifyToken.findUnique({ where: { token } });
  if (!record) return res.status(400).json({ message: "Invalid token" });
  if (record.used) return res.status(400).json({ message: "Token already used" });
  if (record.expiresAt < new Date()) return res.status(400).json({ message: "Token expired" });
  await prisma.user.update({ where: { id: record.userId }, data: { isActive: true } });
  await prisma.emailVerifyToken.update({ where: { id: record.id }, data: { used: true } });
  return res.json({ message: "Email подтверждён. Теперь вы можете войти." });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  if (!user.isActive) {
    return res.status(403).json({ message: "Email not verified" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const access = jwt.sign({ uid: user.id, role: user.role }, process.env.JWT_ACCESS_SECRET!, { expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m" });
  const refresh = jwt.sign({ uid: user.id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d" });

  return res.json({
    message: "Logged in",
    token: access,
    refreshToken: refresh,
    user: { id: user.id, email: user.email, role: user.role, isActive: user.isActive, createdAt: user.createdAt, updatedAt: user.updatedAt }
  });
});

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (!refreshToken) return res.status(400).json({ message: "refreshToken required" });
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
    const access = jwt.sign({ uid: payload.uid }, process.env.JWT_ACCESS_SECRET!, { expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m" });
    return res.json({ token: access });
  } catch {
    return res.status(401).json({ message: "Invalid refreshToken" });
  }
});

// Восстановление пароля — запрос
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email) return res.status(400).json({ message: "Email required" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.json({ message: "If email exists, reset link sent." }); // не раскрываем наличие

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 час
  await prisma.resetToken.create({ data: { token, userId: user.id, expiresAt: expires } });

  const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: `"Mobilive" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: "Сброс пароля — Mobilive",
    html: `<p>Перейдите по ссылке, чтобы сбросить пароль (1 час):</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
  });

  return res.json({ message: "If email exists, reset link sent." });
});

// Сброс пароля — выполнение
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body as { token?: string; newPassword?: string };
  if (!token || !newPassword) return res.status(400).json({ message: "token and newPassword required" });

  const record = await prisma.resetToken.findUnique({ where: { token } });
  if (!record) return res.status(400).json({ message: "Invalid token" });
  if (record.used) return res.status(400).json({ message: "Token already used" });
  if (record.expiresAt < new Date()) return res.status(400).json({ message: "Token expired" });

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: record.userId }, data: { passwordHash } });
  await prisma.resetToken.update({ where: { id: record.id }, data: { used: true } });

  return res.json({ message: "Password updated" });
});