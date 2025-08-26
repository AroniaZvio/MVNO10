import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { requireAuth } from "../../middleware/auth";

export const router = Router();

/**
 * Профиль текущего пользователя
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
        balance: true // Add balance to profile response
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
        balance: true // Add balance to profile update response
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
 * - профиль пользователя
 * - подключённые номера
 * - доступные номера
 *
 * Поддерживает разные варианты схемы:
 *  - PhoneNumber.status === 'available'
 *  - PhoneNumber.userId (null = доступен, =uid = подключён)
 *  - (если связь через таблицу-связку — не падаем, просто отдаём пустые списки)
 */
router.get("/me/dashboard", requireAuth, async (req, res) => {
  try {
    const uid = (req as any).user?.uid as number;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    // 1) Профиль
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
        balance: true // Add balance to dashboard response
      }
    });

    // 2) Подключённые номера
    let connectedNumbers: any[] = [];
    // Ищем номера, которые принадлежат пользователю И имеют статус "connected"
    try {
      connectedNumbers = await prisma.phoneNumber.findMany({
        where: { 
          userId: uid,
          status: "connected" // Только подключенные номера
        },
        orderBy: { id: "asc" },
        select: {
          id: true,
          mobileNumber: true,
          countryName: true,
          countryCode: true,
          status: true,
          connectionFee: true,
          monthlyFee: true,
          reservedAt: true,
          lastPaymentDate: true
        }
      });
    } catch (error) {
      console.error("Error fetching connected numbers:", error);
      connectedNumbers = [];
    }

    // Если есть relation user -> numbers (и она выведена в Prisma) — можно так:
    if (connectedNumbers.length === 0) {
      try {
        const withNumbers = await prisma.user.findUnique({
          where: { id: uid },
          // @ts-ignore — если relation отсутствует, просто упадёт в catch
          include: { numbers: true }
        });
        // @ts-ignore
        connectedNumbers = (withNumbers as any)?.numbers?.filter((n: any) => n.status === "connected") ?? [];
      } catch {}
    }

    // 3) Доступные номера
    let availableNumbers: any[] = [];
    // Сначала пробуем по статусу
    try {
      // @ts-ignore — если поля status нет, пойдём в catch
      availableNumbers = await prisma.phoneNumber.findMany({
        where: { status: "available" },
        orderBy: { id: "asc" }
      });
    } catch {}

    // Если статус не используется, пробуем по userId = null
    if (availableNumbers.length === 0) {
      try {
        // @ts-ignore — если поля userId нет, пойдём дальше
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

export default router;
