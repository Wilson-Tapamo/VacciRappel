type VaccineAge = {
  recommendedAge?: number | null;
  recommendedAgeDays?: number | null;
};

const preciseAgeLabels: Record<number, string> = {
  0: "Naissance",
  42: "6 semaines (1 mois et demi)",
  70: "10 semaines (2 mois et demi)",
  98: "14 semaines (3 mois et demi)",
  180: "6 mois",
  210: "7 mois",
  270: "9 mois",
  450: "15 mois",
  730: "24 mois",
  [9 * 365]: "9 à 14 ans",
};

const scheduleAgeLabels: Record<string, string> = {
  "6 semaines": preciseAgeLabels[42],
  "10 semaines": preciseAgeLabels[70],
  "14 semaines": preciseAgeLabels[98],
};

export function formatVaccineAge(vaccine?: VaccineAge | null) {
  if (!vaccine) return "";

  const ageDays = vaccine.recommendedAgeDays;
  if (ageDays !== null && ageDays !== undefined) {
    const preciseLabel = preciseAgeLabels[ageDays];
    if (preciseLabel) return preciseLabel;
  }

  if (vaccine.recommendedAge === null || vaccine.recommendedAge === undefined) {
    return "";
  }

  return vaccine.recommendedAge === 0
    ? "Naissance"
    : `${vaccine.recommendedAge} mois`;
}

export function formatScheduleAge(age: string) {
  return scheduleAgeLabels[age] || age;
}
