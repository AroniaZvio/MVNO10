import { prisma } from "./lib/prisma";

async function main() {
  const count = await prisma.plan.count();
  if (count > 0) {
    console.log("Plans already seeded");
    return;
  }
  await prisma.plan.createMany({
    data: [
      { name: "Starter", description: "3GB/150мин/50SMS", price: "9.99", dataMb: 3000, minutes: 150, sms: 50 },
      { name: "Pro", description: "15GB/1000мин/500SMS", price: "19.99", dataMb: 15000, minutes: 1000, sms: 500 }
    ]
  });
  console.log("✅ Seed done");
}
main().finally(async () => prisma.$disconnect());