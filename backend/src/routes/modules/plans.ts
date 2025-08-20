import { Router } from "express";
import { prisma } from "../../lib/prisma";

export const router = Router();

router.get("/", async (_req, res) => {
  const plans = await prisma.plan.findMany({ orderBy: { id: "asc" } });
  res.json(plans.map(p => ({
    ...p,
    price: (p as any).price?.toString?.() ?? String(p.price),
  })));
});