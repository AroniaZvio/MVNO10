import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { requireAuth } from "../../middleware/auth";

export const router = Router();

/**
 * Пополнение баланса
 */
router.post("/topup", requireAuth, async (req, res) => {
  try {
    const uid = (req as any).user?.uid as number;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

  const { amount } = req.body as { amount: number };
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Получаем текущего пользователя
    const user = await prisma.user.findUnique({
      where: { id: uid },
      select: { id: true, balance: true }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const balanceBefore = user.balance;
    const balanceAfter = balanceBefore + amount;

    // Обновляем баланс пользователя
    const updatedUser = await prisma.user.update({
      where: { id: uid },
      data: { balance: balanceAfter },
      select: { id: true, balance: true }
    });

    // Создаем запись о транзакции
    await prisma.transaction.create({
      data: {
        userId: uid,
        type: "TOPUP",
        amount: amount,
        description: `Пополнение баланса на $${(amount / 100).toFixed(2)}`,
        balanceBefore,
        balanceAfter,
        metadata: { source: "web" }
      }
    });

    return res.json({
      message: "Balance updated successfully",
      balance: updatedUser.balance,
      balanceFormatted: `$${(updatedUser.balance / 100).toFixed(2)}`
    });

  } catch (e) {
    console.error("Topup error:", e);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * Покупка номера
 */
router.post("/purchase-number", requireAuth, async (req, res) => {
  try {
    const uid = (req as any).user?.uid as number;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    const { 
      phoneNumberId, 
      connectionFee, 
      monthlyFee 
    } = req.body as { 
      phoneNumberId: number; 
      connectionFee: number; 
      monthlyFee: number; 
    };

    if (!phoneNumberId || !connectionFee || !monthlyFee) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const totalCost = connectionFee + monthlyFee;

    // Получаем текущего пользователя
    const user = await prisma.user.findUnique({
      where: { id: uid },
      select: { id: true, balance: true }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Проверяем достаточность средств
    if (user.balance < totalCost) {
      return res.status(400).json({ 
        message: "Insufficient funds",
        required: totalCost,
        available: user.balance
      });
    }

    // Получаем номер телефона
    const phoneNumber = await prisma.phoneNumber.findUnique({
      where: { id: phoneNumberId }
    });

    console.log('🔍 Debug: Phone number lookup:', {
      phoneNumberId,
      found: !!phoneNumber,
      status: phoneNumber?.status,
      userId: phoneNumber?.userId
    });

    if (!phoneNumber) {
      return res.status(404).json({ message: "Phone number not found" });
    }

    if (phoneNumber.status !== "available") {
      console.log('❌ Phone number status check failed:', {
        phoneNumberId,
        currentStatus: phoneNumber.status,
        expectedStatus: "available"
      });
      return res.status(400).json({ message: "Phone number is not available" });
    }

    const balanceBefore = user.balance;
    const balanceAfter = balanceBefore - totalCost;

    // Выполняем транзакцию: обновляем баланс и статус номера
    const [updatedUser, updatedPhoneNumber] = await prisma.$transaction([
      // Обновляем баланс пользователя
      prisma.user.update({
        where: { id: uid },
        data: { balance: balanceAfter },
        select: { id: true, balance: true }
      }),
      
      // Обновляем статус номера
      prisma.phoneNumber.update({
        where: { id: phoneNumberId },
        data: { 
          status: "connected",
          userId: uid,
          reservedAt: new Date(),
          lastPaymentDate: new Date()
        }
      })
    ]);

    // Создаем запись о транзакции
    await prisma.transaction.create({
      data: {
        userId: uid,
        type: "PURCHASE",
        amount: -totalCost, // отрицательная сумма для покупки
        description: `Покупка номера ${phoneNumber.mobileNumber}`,
        balanceBefore,
        balanceAfter,
        metadata: { 
          phoneNumberId,
          connectionFee,
          monthlyFee,
          mobileNumber: phoneNumber.mobileNumber
        }
      }
    });

    return res.json({
      message: "Phone number purchased successfully",
      balance: updatedUser.balance,
      balanceFormatted: `$${(updatedUser.balance / 100).toFixed(2)}`,
      phoneNumber: {
        id: updatedPhoneNumber.id,
        mobileNumber: updatedPhoneNumber.mobileNumber,
        status: updatedPhoneNumber.status
      }
    });

  } catch (e) {
    console.error("Purchase number error:", e);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * Получение истории транзакций пользователя
 */
router.get("/transactions", requireAuth, async (req, res) => {
  try {
    const uid = (req as any).user?.uid as number;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    const { page = 1, limit = 20 } = req.query as { page?: string; limit?: string };
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const offset = (pageNum - 1) * limitNum;

    const [transactions, total] = await prisma.$transaction([
      prisma.transaction.findMany({
        where: { userId: uid },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limitNum,
        select: {
          id: true,
          type: true,
          amount: true,
          description: true,
          balanceBefore: true,
          balanceAfter: true,
          metadata: true,
          createdAt: true
        }
      }),
      prisma.transaction.count({
        where: { userId: uid }
      })
    ]);

    return res.json({
      transactions: transactions.map(t => ({
        ...t,
        amountFormatted: `$${(Math.abs(t.amount) / 100).toFixed(2)}`,
        balanceBeforeFormatted: `$${(t.balanceBefore / 100).toFixed(2)}`,
        balanceAfterFormatted: `$${(t.balanceAfter / 100).toFixed(2)}`
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (e) {
    console.error("Get transactions error:", e);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * Получение текущего баланса пользователя
 */
router.get("/balance", requireAuth, async (req, res) => {
  try {
    const uid = (req as any).user?.uid as number;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { id: uid },
      select: { balance: true }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      balance: user.balance,
      balanceFormatted: `$${(user.balance / 100).toFixed(2)}`
    });

  } catch (e) {
    console.error("Get balance error:", e);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * Отключение номера
 */
router.post("/disconnect-number", requireAuth, async (req, res) => {
  try {
    const uid = (req as any).user?.uid as number;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    const { phoneNumberId } = req.body as { phoneNumberId: number };
    
    if (!phoneNumberId) {
      return res.status(400).json({ message: "Missing phoneNumberId" });
    }

    // Получаем номер телефона
    const phoneNumber = await prisma.phoneNumber.findUnique({
      where: { id: phoneNumberId }
    });

    if (!phoneNumber) {
      return res.status(404).json({ message: "Phone number not found" });
    }

    // Проверяем, что номер принадлежит текущему пользователю
    if (phoneNumber.userId !== uid) {
      return res.status(403).json({ message: "You can only disconnect your own numbers" });
    }

    // Проверяем, что номер подключен
    if (phoneNumber.status !== "connected") {
      return res.status(400).json({ message: "Phone number is not connected" });
    }

    // Рассчитываем сумму возврата (например, 50% от месячной платы)
    const refundAmount = Math.floor(phoneNumber.monthlyFee * 0.5); // 50% от месячной платы

    // Получаем текущего пользователя
    const user = await prisma.user.findUnique({
    where: { id: uid },
    select: { id: true, balance: true }
  });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const balanceBefore = user.balance;
    const balanceAfter = balanceBefore + refundAmount;

    // Выполняем транзакцию: обновляем баланс и статус номера
    const [updatedUser, updatedPhoneNumber] = await prisma.$transaction([
      // Обновляем баланс пользователя
      prisma.user.update({
        where: { id: uid },
        data: { balance: balanceAfter },
        select: { id: true, balance: true }
      }),
      
      // Обновляем статус номера
      prisma.phoneNumber.update({
        where: { id: phoneNumberId },
        data: { 
          status: "available",
          userId: null,
          reservedAt: null,
          expiresAt: null,
          lastPaymentDate: null
        }
      })
    ]);

    // Создаем запись о транзакции
    await prisma.transaction.create({
      data: {
        userId: uid,
        type: "REFUND",
        amount: refundAmount,
        description: `Отключение номера ${phoneNumber.mobileNumber || phoneNumber.number800 || 'неизвестный'}`,
        balanceBefore,
        balanceAfter,
        metadata: { 
          phoneNumberId,
          refundAmount,
          mobileNumber: phoneNumber.mobileNumber,
          number800: phoneNumber.number800
        }
      }
    });

    return res.json({
      message: "Phone number disconnected successfully",
      balance: updatedUser.balance,
      balanceFormatted: `$${(updatedUser.balance / 100).toFixed(2)}`,
      refundAmount,
      refundAmountFormatted: `$${(refundAmount / 100).toFixed(2)}`,
      phoneNumber: {
        id: updatedPhoneNumber.id,
        mobileNumber: updatedPhoneNumber.mobileNumber,
        number800: updatedPhoneNumber.number800,
        status: updatedPhoneNumber.status
      }
    });

  } catch (e) {
    console.error("Disconnect number error:", e);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
