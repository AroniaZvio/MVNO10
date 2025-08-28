import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const list = () => prisma.phoneNumber.findMany({ orderBy: { id: 'asc' } });

export const listPublic = () => prisma.phoneNumber.findMany({
  where: {
    status: "available" // Только доступные номера
  },
  select: {
    id: true,
    countryName: true,
    countryCode: true,
    mobileNumber: true,
    number800: true,
    category: true,
    connectionFee: true,
    monthlyFee: true,
    status: true
  },
  orderBy: { id: 'desc' },
});

export const create = (data: {
  countryCode: string; 
  countryName: string; 
  mobileNumber?: string;
  number800?: string | null; 
  category?: string | null; 
  connectionFee: number; 
  monthlyFee: number;
  status?: string;
}) => {
  // Подготавливаем данные для Prisma
  const prismaData: any = {
    countryCode: data.countryCode,
    countryName: data.countryName,
    category: data.category,
    connectionFee: data.connectionFee,
    monthlyFee: data.monthlyFee,
    status: data.status || "available"
  };

  // Добавляем мобильный номер только если он есть
  if (data.mobileNumber && data.mobileNumber.trim()) {
    prismaData.mobileNumber = data.mobileNumber.trim();
  }

  // Добавляем номер 800 только если он есть
  if (data.number800 && data.number800.trim()) {
    prismaData.number800 = data.number800.trim();
  }

  console.log('🔍 Debug: Prisma create data:', prismaData);
  
  return prisma.phoneNumber.create({ data: prismaData });
};

export const update = (id: number, data: Partial<{
  countryCode: string; countryName: string; mobileNumber: string;
  number800: string | null; category?: string | null; connectionFee: number; monthlyFee: number;
}>) => prisma.phoneNumber.update({ where: { id }, data });

export const remove = (id: number) => prisma.phoneNumber.delete({ where: { id } });

// Получить номер по ID
export const getById = (id: number) => prisma.phoneNumber.findUnique({ where: { id } });

// Подключить номер к пользователю
export const connectToUser = async (numberId: number, userId: number) => {
  return prisma.phoneNumber.update({
    where: { id: numberId },
    data: {
      userId: userId,
      status: 'connected',
      reservedAt: new Date(),
      lastPaymentDate: new Date()
    }
  });
};
