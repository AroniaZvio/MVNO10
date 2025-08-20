import { Router } from "express";
import { requireAuth } from "../../middleware/auth";

export const router = Router();

router.post("/provision", requireAuth, async (_req, res) => {
  // TODO: интеграция с внешним API провайдера МВНО
  res.json({ message: "Provisioning queued" });
});

router.post("/callback", async (_req, res) => {
  // TODO: обработка коллбека от провайдера
  res.json({ message: "Callback received" });
});