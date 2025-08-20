import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const list = () => prisma.phoneNumber.findMany({ orderBy: { id: 'asc' } });

export const listPublic = () => prisma.phoneNumber.findMany({
  select: {
    id: true,
    countryName: true,
    countryCode: true,
    mobileNumber: true,
    number800: true,
    category: true,
    connectionFee: true,
    monthlyFee: true,
  },
  orderBy: { id: 'desc' },
});

export const create = (data: {
  countryCode: string; countryName: string; mobileNumber: string;
  number800?: string | null; category?: string | null; connectionFee: number; monthlyFee: number;
}) => prisma.phoneNumber.create({ data });

export const update = (id: number, data: Partial<{
  countryCode: string; countryName: string; mobileNumber: string;
  number800: string | null; category?: string | null; connectionFee: number; monthlyFee: number;
}>) => prisma.phoneNumber.update({ where: { id }, data });

export const remove = (id: number) => prisma.phoneNumber.delete({ where: { id } });
