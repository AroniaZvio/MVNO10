import { Router } from "express";
import { prisma } from "../lib/prisma";              // путь от src/routes/*
import { requireAuth } from "../middleware/auth";    // путь от src/routes/*

const router = Router();

/**
 * Профиль текущего пользователя
 * GET /api/users/me
 */
router.get("/me", requireAuth, async (req, res) => {
  try {
    const uid = (req as any).user?.uid as number;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { id: uid },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        firstName: true,
        lastName: true,
        username: true,
        balance: true
      }
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * Обновление профиля
 * PUT /api/users/me
 */
router.put("/me", requireAuth, async (req, res) => {
  try {
    const uid = (req as any).user?.uid as number;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    const { firstName, lastName } = req.body as {
      firstName?: string;
      lastName?: string;
    };

    const user = await prisma.user.update({
      where: { id: uid },
      data: { firstName, lastName },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        firstName: true,
        lastName: true,
        username: true,
        balance: true
      }
    });

    return res.json(user);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * Личный кабинет:
 * GET /api/users/me/dashboard
 *  - профиль
 *  - подключённые номера
 *  - доступные номера
 */
router.get("/me/dashboard", requireAuth, async (req, res) => {
  try {
    const uid = (req as any).user?.uid as number;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    // профиль
    const me = await prisma.user.findUnique({
      where: { id: uid },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        firstName: true,
        lastName: true,
        username: true,
        balance: true
      }
    });

    // подключённые номера (пытаемся двумя способами: userId и relation)
    let connectedNumbers: any[] = [];
    try {
      // если в PhoneNumber есть колонка userId
      // @ts-ignore
      connectedNumbers = await prisma.phoneNumber.findMany({
        where: { userId: uid },
        orderBy: { id: "asc" }
      });
    } catch {}

    if (connectedNumbers.length === 0) {
      // если в Prisma описана relation user -> numbers
      try {
        const withNumbers = await prisma.user.findUnique({
          where: { id: uid },
          // @ts-ignore
          include: { numbers: true }
        });
        // @ts-ignore
        connectedNumbers = (withNumbers as any)?.numbers ?? [];
      } catch {}
    }

    // доступные номера (статус или userId=null)
    let availableNumbers: any[] = [];
    try {
      // если есть поле status
      // @ts-ignore
      availableNumbers = await prisma.phoneNumber.findMany({
        where: { status: "available" },
        orderBy: { id: "asc" }
      });
    } catch {}

    if (availableNumbers.length === 0) {
      try {
        // @ts-ignore
        availableNumbers = await prisma.phoneNumber.findMany({
          where: { userId: null },
          orderBy: { id: "asc" }
        });
      } catch {}
    }

    return res.json({
      user: me,
      connectedNumbers,
      availableNumbers
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * Получить подключенный тарифный план пользователя
 * GET /api/users/me/plan
 */
router.get("/me/plan", requireAuth, async (req, res) => {
  try {
    const uid = (req as any).user?.uid as number;
    console.log('🔍 Getting plan for user:', uid);
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    // Ищем активный тариф пользователя
    const userPlan = await prisma.userPlan.findFirst({
      where: { 
        userId: uid,
        status: 'active'
      },
      include: {
        plan: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!userPlan) {
      return res.status(404).json({ message: "No active plan found" });
    }

    return res.json({
      id: userPlan.id,
      planId: userPlan.planId,
      planName: userPlan.plan.name,
      planDescription: userPlan.plan.description || '',
      planPrice: userPlan.plan.price.toString(),
      planDataMb: userPlan.plan.dataMb || 0,
      planMinutes: userPlan.plan.minutes || 0,
      planSms: userPlan.plan.sms || 0,
      connectedAt: userPlan.createdAt.toISOString(),
      status: userPlan.status
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * Подключить тарифный план пользователю
 * POST /api/users/me/plan
 */
router.post("/me/plan", requireAuth, async (req, res) => {
  try {
    const uid = (req as any).user?.uid as number;
    console.log('🔗 Connecting plan for user:', uid);
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    const { planId } = req.body as { planId: number };
    console.log('📋 Plan ID to connect:', planId);
    if (!planId) {
      return res.status(400).json({ message: "planId is required" });
    }

    // Проверяем, что план существует
    const plan = await prisma.plan.findUnique({
      where: { id: planId }
    });

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Деактивируем предыдущий активный тариф
    await prisma.userPlan.updateMany({
      where: { 
        userId: uid,
        status: 'active'
      },
      data: { status: 'expired' }
    });

    // Создаем новый активный тариф
    const userPlan = await prisma.userPlan.create({
      data: {
        userId: uid,
        planId: planId,
        status: 'active'
      },
      include: {
        plan: true
      }
    });

    return res.json({
      id: userPlan.id,
      planId: userPlan.planId,
      planName: userPlan.plan.name,
      planDescription: userPlan.plan.description || '',
      planPrice: userPlan.plan.price.toString(),
      planDataMb: userPlan.plan.dataMb || 0,
      planMinutes: userPlan.plan.minutes || 0,
      planSms: userPlan.plan.sms || 0,
      connectedAt: userPlan.createdAt.toISOString(),
      status: userPlan.status
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
