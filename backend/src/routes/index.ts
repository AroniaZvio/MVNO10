import { Router } from "express";
import userRoutes from "./userRoutes"; // <-- добавили
import { router as auth } from "./modules/auth";
import { router as users } from "./modules/users";
import { router as plans } from "./modules/plans";
import { router as subs } from "./modules/subscriptions";
import { router as sim } from "./modules/sim";
import { router as admin } from "./modules/admin";
import billingRoutes from "./modules/billing";
import phoneNumberRouter from "./modules/phoneNumbers/routes";

const router = Router();

router.use("/auth", auth);
router.use("/users", users);
router.use("/users", userRoutes);     // <-- добавили
router.use("/plans", plans);
router.use("/subscriptions", subs);
router.use("/sim", sim);
router.use("/admin", admin);
router.use("/billing", billingRoutes);
router.use("/admin/phone-numbers", phoneNumberRouter);
router.use("/phone-numbers", phoneNumberRouter);

export { router };
