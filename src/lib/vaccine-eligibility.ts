type VaccineRule = {
  seriesCode: string | null;
  doseNumber: number;
  recommendedAgeDays: number | null;
  minIntervalDays: number | null;
  eligibilityRules: unknown;
};

type RecordRule = {
  status: string;
  completedAt: Date | null;
  vaccine: VaccineRule;
};

export function evaluateVaccineEligibility(
  birthDate: Date,
  current: RecordRule,
  records: RecordRule[],
  now = new Date(),
) {
  if (current.status === "DONE") return { eligible: false, reasons: ["Dose déjà effectuée"], eligibleFrom: null };
  const rules = (current.vaccine.eligibilityRules || {}) as { minimumAgeDays?: number; maxAgeDays?: number };
  const minimumAgeDays = rules.minimumAgeDays ?? current.vaccine.recommendedAgeDays ?? 0;
  const minimumAgeDate = new Date(birthDate.getTime() + minimumAgeDays * 86_400_000);
  const reasons: string[] = [];
  let eligibleFrom = minimumAgeDate;
  if (now < minimumAgeDate) reasons.push(`Âge minimal non atteint (${minimumAgeDays} jours)`);

  if (current.vaccine.seriesCode && current.vaccine.doseNumber > 1) {
    const previous = records.find((record) =>
      record.vaccine.seriesCode === current.vaccine.seriesCode &&
      record.vaccine.doseNumber === current.vaccine.doseNumber - 1,
    );
    if (!previous || previous.status !== "DONE" || !previous.completedAt) {
      reasons.push(`Dose ${current.vaccine.doseNumber - 1} non validée`);
    } else if (current.vaccine.minIntervalDays) {
      const intervalDate = new Date(previous.completedAt.getTime() + current.vaccine.minIntervalDays * 86_400_000);
      if (intervalDate > eligibleFrom) eligibleFrom = intervalDate;
      if (now < intervalDate) reasons.push(`Intervalle minimal de ${current.vaccine.minIntervalDays} jours non atteint`);
    }
  }

  const ageDays = Math.floor((now.getTime() - birthDate.getTime()) / 86_400_000);
  if (typeof rules.maxAgeDays === "number" && ageDays > rules.maxAgeDays) {
    reasons.push("Âge maximal dépassé : avis d’un professionnel requis");
  }
  return { eligible: reasons.length === 0, reasons, eligibleFrom };
}
