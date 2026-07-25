import assert from "node:assert/strict";
import test from "node:test";
import {
  planChildVaccinations,
  type SchedulableVaccine,
} from "./vaccination-schedule";

const routineRules = { schedule: "ROUTINE" };

function vaccine(
  code: string,
  seriesCode: string,
  doseNumber: number,
  recommendedAgeDays: number,
  minIntervalDays: number | null = null,
): SchedulableVaccine {
  return {
    id: code,
    code,
    seriesCode,
    doseNumber,
    recommendedAge: Math.round(recommendedAgeDays / 30),
    recommendedAgeDays,
    minIntervalDays,
    eligibilityRules: routineRules,
  };
}

const vaccines = [
  vaccine("BCG-1", "BCG", 1, 0),
  vaccine("VPO-0", "VPO", 0, 0),
  vaccine("HEPB-DN", "HEPB", 1, 0),
  vaccine("PENTA-1", "PENTA", 1, 42),
  vaccine("PENTA-2", "PENTA", 2, 70, 28),
  vaccine("PENTA-3", "PENTA", 3, 98, 28),
  vaccine("VPO-1", "VPO", 1, 42),
  vaccine("VPO-2", "VPO", 2, 70, 28),
  vaccine("VPO-3", "VPO", 3, 98, 28),
  vaccine("ROTA-1", "ROTA", 1, 42),
  vaccine("ROTA-2", "ROTA", 2, 70, 28),
  vaccine("PCV13-1", "PCV13", 1, 42),
  vaccine("PCV13-2", "PCV13", 2, 70, 28),
  vaccine("PCV13-3", "PCV13", 3, 98, 28),
  vaccine("VPI-1", "VPI", 1, 98),
  vaccine("VIT-A-1", "VIT-A", 1, 180),
  vaccine("RR-1", "RR", 1, 270),
  vaccine("VAA-1", "VAA", 1, 270),
  vaccine("VPI-2", "VPI", 2, 270, 28),
  vaccine("RR-2", "RR", 2, 450, 28),
  vaccine("MENA-1", "MENA", 1, 450),
];

test("keeps the routine calendar anchored to birth for a newborn", () => {
  const plan = planChildVaccinations({
    vaccines,
    birthDate: new Date("2026-06-01"),
    completedVaccineCodes: ["BCG-1", "VPO-0"],
    today: new Date("2026-06-02"),
  });

  assert.equal(plan.mode, "ROUTINE");
  assert.equal(plan.records.find((record) => record.vaccineId === "BCG-1")?.status, "DONE");
  assert.equal(
    plan.records.find((record) => record.vaccineId === "PENTA-1")?.date.toISOString().slice(0, 10),
    "2026-07-13",
  );
});

test("starts zero-dose catch-up contacts from today after six months", () => {
  const plan = planChildVaccinations({
    vaccines,
    birthDate: new Date("2025-12-01"),
    completedVaccineCodes: [],
    today: new Date("2026-07-01"),
  });

  assert.equal(plan.mode, "CATCH_UP");
  assert.equal(plan.records.some((record) => record.vaccineId === "VPO-0"), false);
  assert.equal(
    plan.records.find((record) => record.vaccineId === "PENTA-1")?.date.toISOString().slice(0, 10),
    "2026-07-01",
  );
  assert.equal(
    plan.records.find((record) => record.vaccineId === "PENTA-2")?.date.toISOString().slice(0, 10),
    "2026-07-29",
  );
});

test("reschedules overdue missing doses from today and keeps dose intervals", () => {
  const plan = planChildVaccinations({
    vaccines,
    birthDate: new Date("2026-01-01"),
    completedVaccineCodes: ["PENTA-1"],
    today: new Date("2026-05-01"),
  });

  assert.equal(plan.mode, "ROUTINE");
  assert.equal(
    plan.records.find((record) => record.vaccineId === "PENTA-2")?.date.toISOString().slice(0, 10),
    "2026-05-29",
  );
  assert.equal(
    plan.records.find((record) => record.vaccineId === "PENTA-3")?.date.toISOString().slice(0, 10),
    "2026-06-26",
  );
});

test("selecting a later dose also records previous doses from the same series", () => {
  const plan = planChildVaccinations({
    vaccines,
    birthDate: new Date("2026-01-01"),
    completedVaccineCodes: ["PENTA-3"],
    today: new Date("2026-05-01"),
  });

  for (const code of ["PENTA-1", "PENTA-2", "PENTA-3"]) {
    assert.equal(
      plan.records.find((record) => record.vaccineId === code)?.status,
      "DONE",
    );
  }
  assert.equal(
    plan.records.find((record) => record.vaccineId === "VPO-0"),
    undefined,
  );
});

test("uses the age-appropriate 24-59 month catch-up set", () => {
  const plan = planChildVaccinations({
    vaccines,
    birthDate: new Date("2023-07-01"),
    completedVaccineCodes: [],
    today: new Date("2026-07-01"),
  });

  assert.equal(plan.mode, "CATCH_UP");
  assert.equal(plan.records.some((record) => record.vaccineId === "ROTA-1"), false);
  assert.equal(plan.records.some((record) => record.vaccineId === "PCV13-1"), false);
  assert.equal(plan.records.some((record) => record.vaccineId === "VPO-1"), true);
});
