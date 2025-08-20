import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const list = () => prisma.phoneNumber.findMany({ orderBy: { id: 'asc' } });

export const create = (data: {
  countryCode: string; countryName: string; mobileNumber: string;
  number800?: string | null; connectionFee: number; monthlyFee: number;
}) => prisma.phoneNumber.create({ data });

export const update = (id: number, data: Partial<{
  countryCode: string; countryName: string; mobileNumber: string;
  number800: string | null; connectionFee: number; monthlyFee: number;
}>) => prisma.phoneNumber.update({ where: { id }, data });

export const remove = (id: number) => prisma.phoneNumber.delete({ where: { id } });
