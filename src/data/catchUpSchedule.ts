export type CatchUpContact = {
  label: string;
  timing: string;
  vaccines: string[];
};

export type CatchUpGroup = {
  id: "3-11" | "12-23" | "24-59";
  minMonths: number;
  maxMonths: number;
  title: string;
  contacts: CatchUpContact[];
};

export const catchUpGroups: CatchUpGroup[] = [
  {
    id: "3-11",
    minMonths: 3,
    maxMonths: 11,
    title: "Enfant de 3 à 11 mois jamais vacciné",
    contacts: [
      { label: "1er contact", timing: "Dès que possible", vaccines: ["VPO 1", "Rota 1", "BCG", "Penta 1", "PCV13-1", "VPI 1", "VAP 1*", "Vitamine A**"] },
      { label: "2e contact", timing: "Au moins 28 jours après", vaccines: ["VPO 2", "Rota 2", "Penta 2", "PCV13-2", "VAP 2"] },
      { label: "3e contact", timing: "Au moins 28 jours après", vaccines: ["VPO 3", "Rota 3", "Penta 3", "PCV13-3", "VAP 3"] },
      { label: "4e contact", timing: "Dès 9 mois", vaccines: ["RR 1", "VAA", "VPI 2"] },
    ],
  },
  {
    id: "12-23",
    minMonths: 12,
    maxMonths: 23,
    title: "Enfant de 12 à 23 mois jamais vacciné",
    contacts: [
      { label: "1er contact", timing: "Dès que possible", vaccines: ["VPO 1", "Rota 1*", "Vitamine A**", "Penta 1", "RR 1***", "VPI 1", "PCV13-1", "VAP 1"] },
      { label: "2e contact", timing: "Au moins 28 jours après", vaccines: ["VPO 2", "Rota 2", "Penta 2", "RR 2", "VPI 2", "PCV13-2", "VAP 2"] },
      { label: "3e contact", timing: "Au moins 28 jours après", vaccines: ["VPO 3", "Rota 3", "Penta 3", "VAA****", "VAP 3"] },
    ],
  },
  {
    id: "24-59",
    minMonths: 24,
    maxMonths: 59,
    title: "Enfant de 24 à 59 mois jamais vacciné",
    contacts: [
      { label: "1er contact", timing: "Dès que possible", vaccines: ["VPO 1", "Vitamine A**", "Penta 1", "RR 1***", "VPI 1"] },
      { label: "2e contact", timing: "28 jours après", vaccines: ["VPO 2", "Penta 2", "RR 2", "VPI 2"] },
      { label: "3e contact", timing: "28 jours après", vaccines: ["VPO 3", "Penta 3", "VAA****"] },
    ],
  },
];

export const catchUpRules = [
  "Le BCG ne doit pas être administré à partir de 12 mois.",
  "La dose zéro du VPO ne s’administre pas après les 15 premières heures de vie.",
  "À partir de 24 mois, ne pas administrer le vaccin contre le rotavirus ni le PCV13.",
  "La vitamine A est administrée tous les 6 mois jusqu’à 5 ans.",
  "Le RR est à prioriser dès le premier contact chez un enfant zéro dose âgé d’au moins 10 mois.",
  "Le VAA est prévu dès 10 mois et peut être donné avec le RR. Si le plafond de 4 injections est atteint, reporter le VAA d’au moins 28 jours.",
  "Le RR 2 peut être rattrapé dès 12 mois, au moins 28 jours après le RR 1, idéalement dès 16 mois et avant 5 ans.",
  "Le VAP en rattrapage dès 7 mois concerne l’enfant éligible : résidence dans l’un des 42 districts prioritaires et naissance à partir de juillet 2023. La série doit être terminée avant 24 mois et ne pas être commencée après 21 mois.",
];

export function getAgeInMonths(birthDate?: string) {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let months = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();
  if (today.getDate() < birth.getDate()) months -= 1;
  return Math.max(0, months);
}

export function getCatchUpGroup(ageMonths: number | null) {
  if (ageMonths === null) return null;
  return catchUpGroups.find((group) => ageMonths >= group.minMonths && ageMonths <= group.maxMonths) || null;
}
