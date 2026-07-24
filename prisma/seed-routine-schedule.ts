import { PrismaClient } from "@prisma/client";
import { cameroonVaccineSchedule } from "./cameroon-vaccine-schedule";

const prisma = new PrismaClient();

async function main() {
  for (const vaccine of cameroonVaccineSchedule) {
    await prisma.vaccine.upsert({
      where: { code: vaccine.code! },
      create: vaccine,
      update: vaccine,
    });
  }

  console.log(`${cameroonVaccineSchedule.length} doses vaccinales camerounaises synchronisées.`);
}

main()
  .finally(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
