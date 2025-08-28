import { PrismaClient } from "@prisma/client";
import { config } from "./config";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: config.isDevelopment() ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: config.DATABASE_URL,
    },
  },
});

if (config.isDevelopment()) globalForPrisma.prisma = prisma;