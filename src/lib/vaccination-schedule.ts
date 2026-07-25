const DAY_MS = 86_400_000;

type ScheduleKind = "ROUTINE" | "TARGETED" | "ADOLESCENT";

export type SchedulableVaccine = {
  id: string;
  code: string | null;
  seriesCode: string | null;
  doseNumber: number;
  recommendedAge: number;
  recommendedAgeDays: number | null;
  minIntervalDays: number | null;
  eligibilityRules: unknown;
};

export type PlannedVaccination = {
  vaccineId: string;
  status: "DONE" | "PENDING";
  date: Date;
  completedAt: Date | null;
};

export type VaccinationPlan = {
  mode: "ROUTINE" | "CATCH_UP";
  records: PlannedVaccination[];
};

const catchUpContacts = {
  "6-11": [
    ["BCG-1", "VPO-1", "ROTA-1", "PENTA-1", "PCV13-1", "VPI-1", "VIT-A-1"],
    ["VPO-2", "ROTA-2", "PENTA-2", "PCV13-2"],
    ["VPO-3", "PENTA-3", "PCV13-3"],
    ["RR-1", "VAA-1", "VPI-2"],
  ],
  "12-23": [
    ["VPO-1", "ROTA-1", "VIT-A-1", "PENTA-1", "RR-1", "VPI-1", "PCV13-1"],
    ["VPO-2", "ROTA-2", "PENTA-2", "RR-2", "VPI-2", "PCV13-2"],
    ["VPO-3", "PENTA-3", "VAA-1"],
  ],
  "24-59": [
    ["VPO-1", "VIT-A-1", "PENTA-1", "RR-1", "VPI-1"],
    ["VPO-2", "PENTA-2", "RR-2", "VPI-2"],
    ["VPO-3", "PENTA-3", "VAA-1"],
  ],
} as const;

function startOfUtcDay(date: Date) {
  return new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  ));
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * DAY_MS);
}

function latestDate(...dates: Date[]) {
  return new Date(Math.max(...dates.map((date) => date.getTime())));
}

function getAgeInMonthsAt(birthDate: Date, today: Date) {
  let months =
    (today.getUTCFullYear() - birthDate.getUTCFullYear()) * 12 +
    today.getUTCMonth() -
    birthDate.getUTCMonth();
  if (today.getUTCDate() < birthDate.getUTCDate()) months -= 1;
  return Math.max(0, months);
}

function scheduleKind(vaccine: SchedulableVaccine) {
  return (vaccine.eligibilityRules as { schedule?: ScheduleKind } | null)
    ?.schedule;
}

function isRoutineVaccine(vaccine: SchedulableVaccine, precise: boolean) {
  return !precise || scheduleKind(vaccine) === "ROUTINE";
}

function normalizeCompletedCodes(
  vaccines: SchedulableVaccine[],
  requestedCodes: string[],
  birthDate: Date,
  today: Date,
) {
  const ageDays = Math.floor((today.getTime() - birthDate.getTime()) / DAY_MS);
  const requested = new Set(requestedCodes);
  const completed = new Set<string>();

  for (const vaccine of vaccines) {
    if (
      !vaccine.code ||
      !requested.has(vaccine.code) ||
      (vaccine.recommendedAgeDays ?? 0) > ageDays
    ) {
      continue;
    }

    completed.add(vaccine.code);
    if (!vaccine.seriesCode || vaccine.doseNumber <= 1) continue;

    for (const previous of vaccines) {
      if (
        previous.code &&
        previous.seriesCode === vaccine.seriesCode &&
        previous.doseNumber >= 1 &&
        previous.doseNumber < vaccine.doseNumber &&
        (previous.recommendedAgeDays ?? 0) <= ageDays
      ) {
        completed.add(previous.code);
      }
    }
  }

  return completed;
}

function remainsApplicable(
  vaccine: SchedulableVaccine,
  completedCodes: Set<string>,
  ageDays: number,
  ageMonths: number,
) {
  if (vaccine.code && completedCodes.has(vaccine.code)) return true;
  if (ageDays > 1 && ["VPO-0", "HEPB-DN"].includes(vaccine.code || "")) return false;
  if (ageMonths >= 12 && vaccine.code === "BCG-1") return false;
  if (ageMonths >= 24 && ["ROTA", "PCV13"].includes(vaccine.seriesCode || "")) return false;
  return true;
}

function buildRoutinePlan(
  vaccines: SchedulableVaccine[],
  completedCodes: Set<string>,
  birthDate: Date,
  today: Date,
) {
  const ageDays = Math.floor((today.getTime() - birthDate.getTime()) / DAY_MS);
  const ageMonths = getAgeInMonthsAt(birthDate, today);
  const records: PlannedVaccination[] = [];
  const lastDateBySeries = new Map<string, Date>();

  for (const vaccine of vaccines) {
    if (!remainsApplicable(vaccine, completedCodes, ageDays, ageMonths)) continue;

    const recommendedDate = vaccine.recommendedAgeDays !== null
      ? addDays(birthDate, vaccine.recommendedAgeDays)
      : new Date(Date.UTC(
        birthDate.getUTCFullYear(),
        birthDate.getUTCMonth() + vaccine.recommendedAge,
        birthDate.getUTCDate(),
      ));
    const isDone = Boolean(vaccine.code && completedCodes.has(vaccine.code));
    let plannedDate = isDone ? recommendedDate : latestDate(recommendedDate, today);

    if (vaccine.seriesCode && lastDateBySeries.has(vaccine.seriesCode)) {
      const previousDate = lastDateBySeries.get(vaccine.seriesCode)!;
      const intervalDate = addDays(previousDate, vaccine.minIntervalDays || 0);
      if (!isDone) plannedDate = latestDate(plannedDate, intervalDate);
    }

    if (vaccine.seriesCode) lastDateBySeries.set(vaccine.seriesCode, isDone ? today : plannedDate);
    records.push({
      vaccineId: vaccine.id,
      status: isDone ? "DONE" : "PENDING",
      date: plannedDate,
      completedAt: isDone ? today : null,
    });
  }

  return records;
}

function buildCatchUpPlan(
  vaccines: SchedulableVaccine[],
  birthDate: Date,
  today: Date,
  ageMonths: number,
) {
  const group = ageMonths <= 11
    ? "6-11"
    : ageMonths <= 23
      ? "12-23"
      : "24-59";
  const vaccineByCode = new Map(
    vaccines
      .filter((vaccine) => vaccine.code)
      .map((vaccine) => [vaccine.code!, vaccine]),
  );
  const contacts = catchUpContacts[group];
  const records: PlannedVaccination[] = [];

  contacts.forEach((codes, contactIndex) => {
    let contactDate = addDays(today, contactIndex * 28);
    if (group === "6-11" && contactIndex === 3) {
      contactDate = latestDate(contactDate, addDays(birthDate, 270));
    }

    for (const code of codes) {
      const vaccine = vaccineByCode.get(code);
      if (!vaccine) continue;
      records.push({
        vaccineId: vaccine.id,
        status: "PENDING",
        date: contactDate,
        completedAt: null,
      });
    }
  });

  if (group === "6-11") {
    for (const code of ["RR-2", "MENA-1"]) {
      const vaccine = vaccineByCode.get(code);
      if (!vaccine) continue;
      records.push({
        vaccineId: vaccine.id,
        status: "PENDING",
        date: latestDate(addDays(birthDate, 450), addDays(today, 56)),
        completedAt: null,
      });
    }
  }

  return records;
}

export function planChildVaccinations({
  vaccines,
  birthDate,
  completedVaccineCodes,
  today = new Date(),
}: {
  vaccines: SchedulableVaccine[];
  birthDate: Date;
  completedVaccineCodes: string[];
  today?: Date;
}): VaccinationPlan {
  const normalizedBirthDate = startOfUtcDay(birthDate);
  const normalizedToday = startOfUtcDay(today);
  const precise = vaccines.some((vaccine) => vaccine.recommendedAgeDays !== null);
  const routineVaccines = vaccines
    .filter((vaccine) => isRoutineVaccine(vaccine, precise))
    .sort((a, b) =>
      (a.recommendedAgeDays ?? a.recommendedAge * 30) -
        (b.recommendedAgeDays ?? b.recommendedAge * 30) ||
      (a.seriesCode || "").localeCompare(b.seriesCode || "") ||
      a.doseNumber - b.doseNumber
    );
  const completedCodes = normalizeCompletedCodes(
    routineVaccines,
    completedVaccineCodes,
    normalizedBirthDate,
    normalizedToday,
  );
  const ageMonths = getAgeInMonthsAt(normalizedBirthDate, normalizedToday);
  const isCatchUp = precise &&
    completedCodes.size === 0 &&
    ageMonths >= 6 &&
    ageMonths <= 59;

  return {
    mode: isCatchUp ? "CATCH_UP" : "ROUTINE",
    records: isCatchUp
      ? buildCatchUpPlan(routineVaccines, normalizedBirthDate, normalizedToday, ageMonths)
      : buildRoutinePlan(routineVaccines, completedCodes, normalizedBirthDate, normalizedToday),
  };
}
