import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const hdr = req.headers.authorization;
  if (!hdr?.startsWith("Bearer ")) return res.status(401).json({ message: "No token" });
  const token = hdr.slice("Bearer ".length);
  try {
    const jwtSecret = process.env.JWT_ACCESS_SECRET || "fallback-jwt-secret-key-2024";
    const payload = jwt.verify(token, jwtSecret);
    (req as any).user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user?.role || user.role !== "ADMIN") return res.status(403).json({ message: "Admin only" });
  next();
}