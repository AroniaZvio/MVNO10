import { Router } from "express";
import { router as auth } from "./modules/auth";
import { router as users } from "./modules/users";
import { router as plans } from "./modules/plans";
import { router as subs } from "./modules/subscriptions";
import { router as sim } from "./modules/sim";
import { router as admin } from "./modules/admin";
import { router as billing } from "./modules/billing"; // ← ДОБАВЬ
import phoneNumberRouter from "./modules/phoneNumbers/routes";

export const router = Router();

router.use("/auth", auth);
router.use("/users", users);
router.use("/plans", plans);
router.use("/subscriptions", subs);
router.use("/sim", sim);
router.use("/admin", admin);
router.use("/", billing); // ← подключаем /topup и /transactions
router.use("/admin/phone-numbers", phoneNumberRouter);
router.use("/phone-numbers", phoneNumberRouter);
