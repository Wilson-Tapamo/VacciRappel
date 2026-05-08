import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const v = await prisma.vaccine.findMany();
  console.log('Count:', v.length);
  if (v.length > 0) {
    console.log(v[0]);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
