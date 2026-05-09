import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://neondb_owner:npg_YReX4mZF0frU@ep-sparkling-river-a87vgy70-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require"
        }
    }
});

async function main() {
  const v = await prisma.vaccine.findMany();
  console.log('Count:', v.length);
  if (v.length > 0) {
      console.log('Vaccines in DB:', v.map(vacc => vacc.name).join(', '));
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
