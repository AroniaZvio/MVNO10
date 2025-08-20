import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { requireAuth, requireAdmin } from "../../middleware/auth";

export const router = Router();

// Все роуты ниже — только для админов
router.use(requireAuth, requireAdmin);

// Пользователи — список (пагинация по желанию)
router.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, isActive: true, createdAt: true, updatedAt: true, username: true }
  });
  res.json(users);
});

// Планы — CRUD
router.post("/plans", async (req, res) => {
  const { name, description, price, dataMb, minutes, sms } = req.body;
  const plan = await prisma.plan.create({ data: { name, description, price, dataMb, minutes, sms } });
  res.status(201).json(plan);
});

router.put("/plans/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, description, price, dataMb, minutes, sms } = req.body;
  const plan = await prisma.plan.update({ where: { id }, data: { name, description, price, dataMb, minutes, sms } });
  res.json(plan);
});

router.delete("/plans/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.plan.delete({ where: { id } });
  res.json({ message: "Deleted" });
});