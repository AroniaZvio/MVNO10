import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@mobilive.ge';
  const pass  = process.env.ADMIN_PASSWORD || 'Admin123!';

  const hash = await bcrypt.hash(pass, 10);
  const exists = await prisma.user.findUnique({ where: { email } });
  if (!exists) {
    await prisma.user.create({
      data: { email, password: hash, role: Role.ADMIN }
    });
    console.log('✅ Admin created:', email);
  } else {
    console.log('ℹ️ Admin already exists:', email);
  }
}

main().finally(() => prisma.$disconnect());
