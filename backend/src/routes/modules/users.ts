import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { requireAuth } from "../../middleware/auth";

export const router = Router();

router.get("/me", requireAuth, async (req, res) => {
  const uid = (req as any).user.uid as number;
  const user = await prisma.user.findUnique({
    where: { id: uid },
    select: { id: true, email: true, role: true, isActive: true, createdAt: true, updatedAt: true, firstName: true, lastName: true, username: true }
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json(user);
});

router.put("/me", requireAuth, async (req, res) => {
  const uid = (req as any).user.uid as number;
  const { firstName, lastName } = req.body as { firstName?: string; lastName?: string };
  const user = await prisma.user.update({
    where: { id: uid },
    data: { firstName, lastName },
    select: { id: true, email: true, role: true, isActive: true, createdAt: true, updatedAt: true, firstName: true, lastName: true, username: true }
  });
  return res.json(user);
});