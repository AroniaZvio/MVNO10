import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { requireAuth } from "../../middleware/auth";

export const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const uid = (req as any).user.uid as number;
  const subs = await prisma.subscription.findMany({ where: { userId: uid }, include: { plan: true } });
  res.json(subs);
});

router.post("/", requireAuth, async (req, res) => {
  const uid = (req as any).user.uid as number;
  const { planId } = req.body as { planId: number };
  const sub = await prisma.subscription.create({ data: { userId: uid, planId } });
  res.status(201).json(sub);
});