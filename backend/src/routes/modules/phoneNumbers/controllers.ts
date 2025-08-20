import { Request, Response } from 'express';
import * as svc from './service';

export async function getAll(_req: Request, res: Response) {
  const rows = await svc.list();
  res.json(rows);
}

// Публичный простой список (только нужные поля)
export async function listPublicSimple(_req: Request, res: Response) {
  const rows = await svc.listPublic();
  res.json(rows);
}

export async function createOne(req: Request, res: Response) {
  const b = req.body;
  if (!b.countryCode || !b.countryName)
    return res.status(400).json({ message: 'countryCode и countryName обязательны' });
  if (!b.mobileNumber && !b.number800)
    return res.status(400).json({ message: 'Укажите мобильный номер или номер 800' });

  const row = await svc.create({
    countryCode: b.countryCode,
    countryName: b.countryName,
  category: b.category || null,
    mobileNumber: b.mobileNumber || '',
    number800: b.number800 || null,
    connectionFee: Number(b.connectionFee) || 0,
    monthlyFee: Number(b.monthlyFee) || 0,
  });
  res.status(201).json(row);
}

export async function updateOne(req: Request, res: Response) {
  const id = Number(req.params.id);
  const row = await svc.update(id, {
    countryCode: req.body.countryCode,
    countryName: req.body.countryName,
  category: req.body.category ?? undefined,
    mobileNumber: req.body.mobileNumber,
    number800: req.body.number800 ?? null,
    connectionFee: req.body.connectionFee !== undefined ? Number(req.body.connectionFee) : undefined,
    monthlyFee: req.body.monthlyFee !== undefined ? Number(req.body.monthlyFee) : undefined,
  });
  res.json(row);
}

export async function removeOne(req: Request, res: Response) {
  const id = Number(req.params.id);
  await svc.remove(id);
  res.json({ ok: true });
}
