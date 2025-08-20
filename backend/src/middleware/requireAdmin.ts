import { Request, Response, NextFunction } from 'express';

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user; // verifyJWT должен положить сюда { id, email, role }
  if (!user) return res.status(401).json({ message: 'Unauthorized' });
  if (user.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });
  next();
}
