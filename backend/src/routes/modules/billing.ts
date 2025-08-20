import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { requireAuth } from "../../middleware/auth";

// MVP: имитация успешного платежа — начисляем на баланс и пишем Transaction
export const router = Router();

/**
 * POST /api/topup
 * body: { amount: number }
 */
router.post("/topup", requireAuth, async (req, res) => {
  const uid = (req as any).user.uid as number;
  const { amount } = req.body as { amount?: number };

  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    return res.status(400).json({ message: "amount must be > 0" });
  }

  // Транзакция БД: увеличиваем баланс и пишем запись в Transaction
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: uid },
      data: { balance: { increment: amount } },
      select: { id: true, email: true, balance: true }
    });

    const trx = await tx.transaction.create({
      data: { userId: uid, amount: amount.toFixed(2), type: "topup" } // Decimal как строка ок
    });

    return { user, trx };
  });

  return res.status(201).json({
    message: "Topup successful (MVP)",
    balance: result.user.balance,
    transaction: result.trx
  });
});

/**
 * GET /api/transactions
 * Список моих транзакций (последние 50)
 */
router.get("/transactions", requireAuth, async (req, res) => {
  const uid = (req as any).user.uid as number;
  const list = await prisma.transaction.findMany({
    where: { userId: uid },
    orderBy: { createdAt: "desc" },
    take: 50
  });
  res.json(list);
});
