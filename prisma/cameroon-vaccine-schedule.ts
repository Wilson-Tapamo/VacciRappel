import type { Prisma } from "@prisma/client";

type ScheduleKind = "ROUTINE" | "TARGETED" | "ADOLESCENT";

type SeriesDetails = {
  protection: string;
  importance: string;
  description: string;
  longDescription: string;
  benefits: string[];
  sideEffectsCommon: string[];
  sideEffectsRare: string[];
  didYouKnow: string;
  totalDoses: number;
  scheduleAges: string[];
  schedule: ScheduleKind;
  targetNote?: string;
};

type DoseSpec = {
  code: string;
  seriesCode: string;
  doseNumber: number;
  name: string;
  ageDays: number;
  minIntervalDays: number | null;
  route: string;
  details: SeriesDetails;
};

const minsanteSource =
  "https://biblio-minsante.cm/server/api/core/bitstreams/4c22878d-bdaa-473b-8dcf-7290dd9e79ec/content";
const malariaSource =
  "https://www.afro.who.int/photo-story/cameroon-vaccinates-against-malaria";
const hpvSource =
  "https://www.afro.who.int/fr/news/un-vaccin-dose-unique-contre-le-vph-pour-faire-progresser-les-efforts-de-vaccination";

const commonInjectionEffects = ["Douleur ou rougeur au point d’injection", "Fièvre légère ou irritabilité"];
const rareInjectionEffects = ["Réaction allergique sévère, très rare"];

const series = {
  BCG: {
    protection: "Formes graves de tuberculose",
    importance: "Vaccination de routine",
    description: "Dose unique recommandée dès la naissance.",
    longDescription:
      "Le BCG fait partie du premier contact du Programme Élargi de Vaccination au Cameroun. Il protège surtout le nourrisson contre les formes graves de tuberculose.",
    benefits: ["Protection précoce du nouveau-né", "Réduit le risque de tuberculose grave chez l’enfant"],
    sideEffectsCommon: ["Petite papule puis cicatrice au point d’injection"],
    sideEffectsRare: ["Adénopathie locale importante, rare"],
    didYouKnow: "Le BCG est un vaccin lyophilisé : après reconstitution, le flacon doit être utilisé pendant la séance prévue.",
    totalDoses: 1,
    scheduleAges: ["Naissance"],
    schedule: "ROUTINE",
  },
  VPO: {
    protection: "Poliomyélite",
    importance: "Vaccination de routine",
    description: "Vaccin antipoliomyélitique administré par voie orale.",
    longDescription:
      "Le calendrier camerounais prévoit une dose à la naissance puis des doses à 6, 10 et 14 semaines pour renforcer progressivement la protection contre la poliomyélite.",
    benefits: ["Protège contre une maladie pouvant entraîner une paralysie irréversible", "Administration orale"],
    sideEffectsCommon: ["Généralement aucun effet notable"],
    sideEffectsRare: ["Réaction indésirable grave, extrêmement rare"],
    didYouKnow: "Les campagnes antipolio peuvent ajouter des doses en dehors du calendrier de routine.",
    totalDoses: 4,
    scheduleAges: ["Naissance", "6 semaines", "10 semaines", "14 semaines"],
    schedule: "ROUTINE",
  },
  HEPB: {
    protection: "Hépatite B",
    importance: "Dose de naissance",
    description: "Première dose contre l’hépatite B, idéalement dans les 24 heures.",
    longDescription:
      "Le calendrier camerounais recommande une dose monovalente contre l’hépatite B dès la naissance, suivie de la protection contenue dans les trois doses du vaccin pentavalent.",
    benefits: ["Réduit la transmission précoce du virus", "Prévient l’hépatite chronique et ses complications"],
    sideEffectsCommon: commonInjectionEffects,
    sideEffectsRare: rareInjectionEffects,
    didYouKnow: "Les doses suivantes contre l’hépatite B sont incluses dans le vaccin pentavalent.",
    totalDoses: 4,
    scheduleAges: ["Naissance", "6 semaines", "10 semaines", "14 semaines"],
    schedule: "ROUTINE",
  },
  PENTA: {
    protection: "Diphtérie, tétanos, coqueluche, hépatite B et Hib",
    importance: "Vaccination de routine",
    description: "Cinq protections réunies dans une injection.",
    longDescription:
      "Le vaccin pentavalent est administré en trois doses à 6, 10 et 14 semaines dans le calendrier camerounais.",
    benefits: ["Protège contre cinq maladies graves", "Réduit le nombre d’injections nécessaires"],
    sideEffectsCommon: commonInjectionEffects,
    sideEffectsRare: ["Cris persistants ou réaction allergique, rares"],
    didYouKnow: "Un intervalle minimal de 28 jours sépare les doses de la série primaire.",
    totalDoses: 3,
    scheduleAges: ["6 semaines", "10 semaines", "14 semaines"],
    schedule: "ROUTINE",
  },
  PCV13: {
    protection: "Infections à pneumocoque",
    importance: "Vaccination de routine",
    description: "Protection contre les pneumonies, méningites et septicémies à pneumocoque.",
    longDescription:
      "Le vaccin pneumococcique conjugué est administré à 6, 10 et 14 semaines dans le calendrier de routine.",
    benefits: ["Réduit les pneumonies graves", "Protège contre certaines méningites bactériennes"],
    sideEffectsCommon: commonInjectionEffects,
    sideEffectsRare: rareInjectionEffects,
    didYouKnow: "Les trois doses accompagnent les contacts du vaccin pentavalent.",
    totalDoses: 3,
    scheduleAges: ["6 semaines", "10 semaines", "14 semaines"],
    schedule: "ROUTINE",
  },
  ROTA: {
    protection: "Diarrhées sévères à rotavirus",
    importance: "Vaccination de routine",
    description: "Vaccin oral contre les gastro-entérites sévères du nourrisson.",
    longDescription:
      "Le calendrier MINSANTÉ 2026 prévoit deux doses de vaccin antirotavirus à 6 et 10 semaines.",
    benefits: ["Réduit les diarrhées sévères", "Diminue le risque de déshydratation et d’hospitalisation"],
    sideEffectsCommon: ["Irritabilité, diarrhée légère ou vomissement transitoire"],
    sideEffectsRare: ["Invagination intestinale, très rare"],
    didYouKnow: "Le produit utilisé et l’âge de l’enfant doivent être confirmés par le centre de vaccination.",
    totalDoses: 2,
    scheduleAges: ["6 semaines", "10 semaines"],
    schedule: "ROUTINE",
  },
  VPI: {
    protection: "Poliomyélite",
    importance: "Vaccination de routine",
    description: "Vaccin antipoliomyélitique inactivé injectable.",
    longDescription:
      "Deux doses de VPI sont prévues au Cameroun : la première à 14 semaines et la seconde à 9 mois.",
    benefits: ["Renforce la protection antipolio", "Complète les doses administrées par voie orale"],
    sideEffectsCommon: commonInjectionEffects,
    sideEffectsRare: rareInjectionEffects,
    didYouKnow: "Le VPI et le VPO sont complémentaires dans la stratégie d’éradication de la poliomyélite.",
    totalDoses: 2,
    scheduleAges: ["14 semaines", "9 mois"],
    schedule: "ROUTINE",
  },
  VITA: {
    protection: "Carence en vitamine A",
    importance: "Supplément de santé infantile",
    description: "Supplément de vitamine A à partir de 6 mois.",
    longDescription:
      "La vitamine A n’est pas un vaccin. Elle est intégrée aux contacts de santé infantile à partir de 6 mois et peut être répétée selon les directives du centre jusqu’à 5 ans.",
    benefits: ["Soutient la vision et l’immunité", "Prévient les conséquences de la carence"],
    sideEffectsCommon: ["Nausée ou irritabilité transitoire"],
    sideEffectsRare: ["Vomissements, rares à la dose recommandée"],
    didYouKnow: "Le professionnel de santé indique la date de la prochaine supplémentation.",
    totalDoses: 1,
    scheduleAges: ["À partir de 6 mois, puis selon le centre"],
    schedule: "ROUTINE",
  },
  RR: {
    protection: "Rougeole et rubéole",
    importance: "Vaccination de routine",
    description: "Deux doses contre la rougeole et la rubéole.",
    longDescription:
      "Le calendrier camerounais prévoit une première dose à 9 mois et une seconde à 15 mois.",
    benefits: ["Réduit les flambées de rougeole", "Prévient la rubéole et ses complications"],
    sideEffectsCommon: ["Fièvre légère ou petite éruption retardée"],
    sideEffectsRare: rareInjectionEffects,
    didYouKnow: "Le RR est lyophilisé ; certains centres regroupent les vaccinations un jour précis pour limiter le gaspillage.",
    totalDoses: 2,
    scheduleAges: ["9 mois", "15 mois"],
    schedule: "ROUTINE",
  },
  VAA: {
    protection: "Fièvre jaune",
    importance: "Vaccination de routine",
    description: "Dose unique recommandée à 9 mois.",
    longDescription:
      "La fièvre jaune est endémique au Cameroun. Une dose est prévue à 9 mois dans le calendrier national.",
    benefits: ["Protection durable", "Prévient une maladie virale potentiellement mortelle"],
    sideEffectsCommon: ["Fièvre légère, maux de tête ou douleurs musculaires"],
    sideEffectsRare: ["Réaction sévère post-vaccinale, très rare"],
    didYouKnow: "Le vaccin antiamaril est lyophilisé et doit être utilisé rapidement après reconstitution.",
    totalDoses: 1,
    scheduleAges: ["9 mois"],
    schedule: "ROUTINE",
  },
  MENA: {
    protection: "Méningites à méningocoques",
    importance: "Vaccination de routine",
    description: "Vaccin conjugué contre les méningocoques à 15 mois.",
    longDescription:
      "Le calendrier MINSANTÉ 2026 prévoit un vaccin MenA/ACYW135 au contact de 15 mois, avec la seconde dose RR.",
    benefits: ["Réduit le risque de méningite bactérienne", "Renforce la protection dans la ceinture africaine de la méningite"],
    sideEffectsCommon: commonInjectionEffects,
    sideEffectsRare: rareInjectionEffects,
    didYouKnow: "La présentation utilisée par le centre peut nécessiter une reconstitution.",
    totalDoses: 1,
    scheduleAges: ["15 mois"],
    schedule: "ROUTINE",
  },
  VAP: {
    protection: "Paludisme",
    importance: "Programme ciblé",
    description: "Vaccin RTS,S proposé dans les districts camerounais éligibles.",
    longDescription:
      "Le vaccin antipaludique est déployé dans des districts à forte charge. Le schéma camerounais comporte quatre doses à 6, 7, 9 et 24 mois. Le centre doit confirmer l’éligibilité géographique.",
    benefits: ["Réduit le risque de paludisme grave", "Complète la moustiquaire et les autres mesures de prévention"],
    sideEffectsCommon: commonInjectionEffects,
    sideEffectsRare: rareInjectionEffects,
    didYouKnow: "Le vaccin ne remplace pas la moustiquaire imprégnée ni la consultation en cas de fièvre.",
    totalDoses: 4,
    scheduleAges: ["6 mois", "7 mois", "9 mois", "24 mois"],
    schedule: "TARGETED",
    targetNote: "Uniquement dans les districts où le vaccin antipaludique est déployé.",
  },
  HPV: {
    protection: "Cancers liés au papillomavirus humain",
    importance: "Programme adolescent",
    description: "Dose unique pour les filles et garçons de 9 à 14 ans.",
    longDescription:
      "Le Cameroun propose le vaccin HPV aux filles et garçons de 9 à 14 ans afin de prévenir plusieurs cancers liés au papillomavirus.",
    benefits: ["Prévient la majorité des cancers du col de l’utérus", "Protège avant l’exposition au virus"],
    sideEffectsCommon: commonInjectionEffects,
    sideEffectsRare: rareInjectionEffects,
    didYouKnow: "Le Cameroun a adopté un schéma à dose unique et étendu la vaccination aux garçons.",
    totalDoses: 1,
    scheduleAges: ["9 à 14 ans"],
    schedule: "ADOLESCENT",
    targetNote: "Filles et garçons de 9 à 14 ans.",
  },
} satisfies Record<string, SeriesDetails>;

const doseSpecs: DoseSpec[] = [
  { code: "BCG-1", seriesCode: "BCG", doseNumber: 1, name: "BCG", ageDays: 0, minIntervalDays: null, route: "Intradermique", details: series.BCG },
  { code: "VPO-0", seriesCode: "VPO", doseNumber: 0, name: "VPO 0", ageDays: 0, minIntervalDays: null, route: "Orale", details: series.VPO },
  { code: "HEPB-DN", seriesCode: "HEPB", doseNumber: 1, name: "Hépatite B naissance", ageDays: 0, minIntervalDays: null, route: "Intramusculaire", details: series.HEPB },
  { code: "PENTA-1", seriesCode: "PENTA", doseNumber: 1, name: "Pentavalent 1", ageDays: 42, minIntervalDays: null, route: "Intramusculaire", details: series.PENTA },
  { code: "VPO-1", seriesCode: "VPO", doseNumber: 1, name: "VPO 1", ageDays: 42, minIntervalDays: null, route: "Orale", details: series.VPO },
  { code: "PCV13-1", seriesCode: "PCV13", doseNumber: 1, name: "Pneumocoque 1", ageDays: 42, minIntervalDays: null, route: "Intramusculaire", details: series.PCV13 },
  { code: "ROTA-1", seriesCode: "ROTA", doseNumber: 1, name: "Rotavirus 1", ageDays: 42, minIntervalDays: null, route: "Orale", details: series.ROTA },
  { code: "PENTA-2", seriesCode: "PENTA", doseNumber: 2, name: "Pentavalent 2", ageDays: 70, minIntervalDays: 28, route: "Intramusculaire", details: series.PENTA },
  { code: "VPO-2", seriesCode: "VPO", doseNumber: 2, name: "VPO 2", ageDays: 70, minIntervalDays: 28, route: "Orale", details: series.VPO },
  { code: "PCV13-2", seriesCode: "PCV13", doseNumber: 2, name: "Pneumocoque 2", ageDays: 70, minIntervalDays: 28, route: "Intramusculaire", details: series.PCV13 },
  { code: "ROTA-2", seriesCode: "ROTA", doseNumber: 2, name: "Rotavirus 2", ageDays: 70, minIntervalDays: 28, route: "Orale", details: series.ROTA },
  { code: "PENTA-3", seriesCode: "PENTA", doseNumber: 3, name: "Pentavalent 3", ageDays: 98, minIntervalDays: 28, route: "Intramusculaire", details: series.PENTA },
  { code: "VPO-3", seriesCode: "VPO", doseNumber: 3, name: "VPO 3", ageDays: 98, minIntervalDays: 28, route: "Orale", details: series.VPO },
  { code: "PCV13-3", seriesCode: "PCV13", doseNumber: 3, name: "Pneumocoque 3", ageDays: 98, minIntervalDays: 28, route: "Intramusculaire", details: series.PCV13 },
  { code: "VPI-1", seriesCode: "VPI", doseNumber: 1, name: "VPI 1", ageDays: 98, minIntervalDays: null, route: "Intramusculaire", details: series.VPI },
  { code: "VIT-A-1", seriesCode: "VIT-A", doseNumber: 1, name: "Vitamine A", ageDays: 180, minIntervalDays: null, route: "Orale", details: series.VITA },
  { code: "RR-1", seriesCode: "RR", doseNumber: 1, name: "Rougeole-Rubéole 1", ageDays: 270, minIntervalDays: null, route: "Sous-cutanée", details: series.RR },
  { code: "VAA-1", seriesCode: "VAA", doseNumber: 1, name: "Fièvre jaune", ageDays: 270, minIntervalDays: null, route: "Sous-cutanée", details: series.VAA },
  { code: "VPI-2", seriesCode: "VPI", doseNumber: 2, name: "VPI 2", ageDays: 270, minIntervalDays: 28, route: "Intramusculaire", details: series.VPI },
  { code: "RR-2", seriesCode: "RR", doseNumber: 2, name: "Rougeole-Rubéole 2", ageDays: 450, minIntervalDays: 28, route: "Sous-cutanée", details: series.RR },
  { code: "MENA-1", seriesCode: "MENA", doseNumber: 1, name: "Méningocoque A/ACYW135", ageDays: 450, minIntervalDays: null, route: "Intramusculaire", details: series.MENA },
  { code: "VAP-1", seriesCode: "VAP", doseNumber: 1, name: "Paludisme 1", ageDays: 180, minIntervalDays: null, route: "Intramusculaire", details: series.VAP },
  { code: "VAP-2", seriesCode: "VAP", doseNumber: 2, name: "Paludisme 2", ageDays: 210, minIntervalDays: 28, route: "Intramusculaire", details: series.VAP },
  { code: "VAP-3", seriesCode: "VAP", doseNumber: 3, name: "Paludisme 3", ageDays: 270, minIntervalDays: 28, route: "Intramusculaire", details: series.VAP },
  { code: "VAP-4", seriesCode: "VAP", doseNumber: 4, name: "Paludisme 4", ageDays: 730, minIntervalDays: 365, route: "Intramusculaire", details: series.VAP },
  { code: "HPV-1", seriesCode: "HPV", doseNumber: 1, name: "HPV", ageDays: 9 * 365, minIntervalDays: null, route: "Intramusculaire", details: series.HPV },
];

export const cameroonVaccineSchedule: Prisma.VaccineCreateInput[] = doseSpecs.map(
  ({ details, ageDays, ...dose }) => ({
    ...dose,
    recommendedAge: Math.round(ageDays / 30),
    recommendedAgeDays: ageDays,
    protection: details.protection,
    importance: details.importance,
    description: details.description,
    longDescription: details.longDescription,
    benefits: details.benefits,
    sideEffectsCommon: details.sideEffectsCommon,
    sideEffectsRare: details.sideEffectsRare,
    didYouKnow: details.didYouKnow,
    fullProtectionList: [],
    eligibilityRules: {
      schedule: details.schedule,
      targetNote: details.targetNote,
      totalDoses: details.totalDoses,
      scheduleAges: details.scheduleAges,
      sourceLabel:
        details.schedule === "TARGETED"
          ? "OMS Afrique - déploiement du vaccin antipaludique au Cameroun"
          : details.schedule === "ADOLESCENT"
            ? "OMS Afrique - vaccination HPV au Cameroun"
            : "MINSANTÉ Cameroun - calendrier PEV 2026",
      sourceUrl:
        details.schedule === "TARGETED"
          ? malariaSource
          : details.schedule === "ADOLESCENT"
            ? hpvSource
            : minsanteSource,
    },
  }),
);

export const routineVaccineCodes = cameroonVaccineSchedule
  .filter((vaccine) => {
    const rules = vaccine.eligibilityRules as { schedule?: ScheduleKind } | undefined;
    return rules?.schedule === "ROUTINE";
  })
  .map((vaccine) => vaccine.code as string);
