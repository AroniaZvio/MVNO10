import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { prisma } from "../../lib/prisma";

const router = Router();

/** POST /api/billing/topup { amount: number } */
router.post("/topup", requireAuth, async (req, res) => {
  const uid = (req as any).user.uid as number;
  const { amount } = req.body as { amount: number };
  if (!amount || amount <= 0) return res.status(400).json({ message: "Amount > 0 required" });

  const updated = await prisma.user.update({
    where: { id: uid },
    data: { balance: { increment: Math.floor(amount) } },
    select: { id: true, balance: true }
  });

  return res.json(updated);
});

export default router;
