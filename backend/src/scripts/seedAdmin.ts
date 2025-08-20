
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@mobilive.ge';
  const pass  = process.env.ADMIN_PASSWORD || 'Admin123!';

  const hash = await bcrypt.hash(pass, 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash: hash,
      role: 'ADMIN' as any,
      isActive: true,
    },
    create: {
      email,
      passwordHash: hash,
      role: 'ADMIN' as any,
      isActive: true,
      firstName: 'Admin',
      lastName: null,
      username: 'admin'
    },
  });

  console.log('✅ Admin ready:', email);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
