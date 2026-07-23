import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const schedule: Prisma.VaccineCreateInput[] = [
  { code: "BCG-1", seriesCode: "BCG", doseNumber: 1, name: "BCG", protection: "Tuberculose", recommendedAge: 0, recommendedAgeDays: 0, minIntervalDays: null, route: "Intradermique", eligibilityRules: { schedule: "ROUTINE" }, benefits: [], sideEffectsCommon: [], sideEffectsRare: [] },
  { code: "VPO-0", seriesCode: "VPO", doseNumber: 0, name: "VPO 0", protection: "Poliomyélite", recommendedAge: 0, recommendedAgeDays: 0, minIntervalDays: null, route: "Orale", eligibilityRules: { schedule: "ROUTINE" }, benefits: [], sideEffectsCommon: [], sideEffectsRare: [] },
  { code: "VPO-1", seriesCode: "VPO", doseNumber: 1, name: "VPO 1", protection: "Poliomyélite", recommendedAge: 1, recommendedAgeDays: 42, minIntervalDays: 28, route: "Orale", benefits: [], sideEffectsCommon: [], sideEffectsRare: [] },
  { code: "VPO-2", seriesCode: "VPO", doseNumber: 2, name: "VPO 2", protection: "Poliomyélite", recommendedAge: 2, recommendedAgeDays: 70, minIntervalDays: 28, route: "Orale", benefits: [], sideEffectsCommon: [], sideEffectsRare: [] },
  { code: "VPO-3", seriesCode: "VPO", doseNumber: 3, name: "VPO 3", protection: "Poliomyélite", recommendedAge: 3, recommendedAgeDays: 98, minIntervalDays: 28, route: "Orale", benefits: [], sideEffectsCommon: [], sideEffectsRare: [] },
  { code: "PENTA-1", seriesCode: "PENTA", doseNumber: 1, name: "Pentavalent 1", protection: "Diphtérie, Tétanos, Coqueluche, Hépatite B, Hib", recommendedAge: 1, recommendedAgeDays: 42, minIntervalDays: 28, route: "Intramusculaire", benefits: [], sideEffectsCommon: [], sideEffectsRare: [] },
  { code: "PENTA-2", seriesCode: "PENTA", doseNumber: 2, name: "Pentavalent 2", protection: "Diphtérie, Tétanos, Coqueluche, Hépatite B, Hib", recommendedAge: 2, recommendedAgeDays: 70, minIntervalDays: 28, route: "Intramusculaire", benefits: [], sideEffectsCommon: [], sideEffectsRare: [] },
  { code: "PENTA-3", seriesCode: "PENTA", doseNumber: 3, name: "Pentavalent 3", protection: "Diphtérie, Tétanos, Coqueluche, Hépatite B, Hib", recommendedAge: 3, recommendedAgeDays: 98, minIntervalDays: 28, route: "Intramusculaire", benefits: [], sideEffectsCommon: [], sideEffectsRare: [] },
  { code: "PCV13-1", seriesCode: "PCV13", doseNumber: 1, name: "PCV13 1", protection: "Infections à pneumocoque", recommendedAge: 1, recommendedAgeDays: 42, minIntervalDays: 28, route: "Intramusculaire", benefits: [], sideEffectsCommon: [], sideEffectsRare: [] },
  { code: "PCV13-2", seriesCode: "PCV13", doseNumber: 2, name: "PCV13 2", protection: "Infections à pneumocoque", recommendedAge: 2, recommendedAgeDays: 70, minIntervalDays: 28, route: "Intramusculaire", benefits: [], sideEffectsCommon: [], sideEffectsRare: [] },
  { code: "PCV13-3", seriesCode: "PCV13", doseNumber: 3, name: "PCV13 3", protection: "Infections à pneumocoque", recommendedAge: 3, recommendedAgeDays: 98, minIntervalDays: 28, route: "Intramusculaire", benefits: [], sideEffectsCommon: [], sideEffectsRare: [] },
  { code: "ROTA-1", seriesCode: "ROTA", doseNumber: 1, name: "Rotavirus 1", protection: "Diarrhées sévères à rotavirus", recommendedAge: 1, recommendedAgeDays: 42, minIntervalDays: 28, route: "Orale", benefits: [], sideEffectsCommon: [], sideEffectsRare: [] },
  { code: "ROTA-2", seriesCode: "ROTA", doseNumber: 2, name: "Rotavirus 2", protection: "Diarrhées sévères à rotavirus", recommendedAge: 2, recommendedAgeDays: 70, minIntervalDays: 28, route: "Orale", benefits: [], sideEffectsCommon: [], sideEffectsRare: [] },
  { code: "ROTA-3", seriesCode: "ROTA", doseNumber: 3, name: "Rotavirus 3", protection: "Diarrhées sévères à rotavirus", recommendedAge: 3, recommendedAgeDays: 98, minIntervalDays: 28, route: "Orale", benefits: [], sideEffectsCommon: [], sideEffectsRare: [] },
  { code: "VPI-1", seriesCode: "VPI", doseNumber: 1, name: "VPI 1", protection: "Poliomyélite", recommendedAge: 3, recommendedAgeDays: 98, minIntervalDays: 28, route: "Intramusculaire", benefits: [], sideEffectsCommon: [], sideEffectsRare: [] },
  { code: "VIT-A-1", seriesCode: "VIT-A", doseNumber: 1, name: "Vitamine A", protection: "Carence en vitamine A", recommendedAge: 6, recommendedAgeDays: 180, minIntervalDays: 180, route: "Orale", eligibilityRules: { repeatUntilAgeDays: 1825 }, benefits: [], sideEffectsCommon: [], sideEffectsRare: [] },
  { code: "RR-1", seriesCode: "RR", doseNumber: 1, name: "RR 1", protection: "Rougeole, Rubéole", recommendedAge: 9, recommendedAgeDays: 270, minIntervalDays: 28, route: "Sous-cutanée", benefits: [], sideEffectsCommon: [], sideEffectsRare: [] },
  { code: "VAA-1", seriesCode: "VAA", doseNumber: 1, name: "Fièvre jaune", protection: "Fièvre jaune", recommendedAge: 9, recommendedAgeDays: 270, minIntervalDays: null, route: "Sous-cutanée", benefits: [], sideEffectsCommon: [], sideEffectsRare: [] },
  { code: "VPI-2", seriesCode: "VPI", doseNumber: 2, name: "VPI 2", protection: "Poliomyélite", recommendedAge: 9, recommendedAgeDays: 270, minIntervalDays: 28, route: "Intramusculaire", benefits: [], sideEffectsCommon: [], sideEffectsRare: [] },
  { code: "RR-2", seriesCode: "RR", doseNumber: 2, name: "RR 2", protection: "Rougeole, Rubéole", recommendedAge: 15, recommendedAgeDays: 450, minIntervalDays: 28, route: "Sous-cutanée", benefits: [], sideEffectsCommon: [], sideEffectsRare: [] },
];

async function main() {
  for (const vaccine of schedule) {
    await prisma.vaccine.upsert({
      where: { code: vaccine.code! },
      create: vaccine,
      update: vaccine,
    });
  }
}

main()
  .finally(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
