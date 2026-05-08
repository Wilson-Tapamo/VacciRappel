import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const vaccines = [
    {
        name: "BCG",
        description: "Protection contre la tuberculose.",
        recommendedAge: 0,
        importance: "Fondamental",
        protection: "Tuberculose",
        longDescription: "Le BCG est administré dès la naissance dans le Programme Élargi de Vaccination (PEV) au Cameroun pour protéger surtout les nouveau-nés contre les formes graves de tuberculose, notamment les formes disséminées et méningées. Il est offert gratuitement dans les formations sanitaires publiques et fait partie des vaccins de base du nourrisson.",
        benefits: [
            "Prévient surtout les formes graves de tuberculose chez le nourrisson et le jeune enfant",
            "Protection précoce dès les premiers jours de vie",
            "Vaccin ancien, largement utilisé et bien connu dans les programmes de santé publique",
            "Participe à la réduction des décès liés à la tuberculose infantile"
        ],
        sideEffectsCommon: [
            "Petite rougeur au point d'injection",
            "Petite papule ou nodule local",
            "Cicatrice vaccinale"
        ],
        sideEffectsRare: [
            "Légère fièvre",
            "Inflammation locale plus marquée",
            "Adénopathie locale"
        ],
        didYouKnow: "Le BCG est surtout utile contre les formes graves de tuberculose chez l’enfant, plutôt que contre toutes les formes de la maladie."
    },
    {
        name: "VPO 0",
        description: "Première protection contre la poliomyélite à la naissance.",
        recommendedAge: 0,
        importance: "Fondamental",
        protection: "Poliomyélite",
        longDescription: "Le VPO 0 est administré à la naissance dans le cadre du PEV au Cameroun. Il complète la protection précoce contre la poliomyélite avant les doses ultérieures du calendrier vaccinal.",
        benefits: [
            "Protège précocement contre la poliomyélite",
            "Complète le schéma vaccinal du nourrisson",
            "Facile à administrer"
        ],
        sideEffectsCommon: [
            "Aucun effet notable",
            "Irritabilité transitoire"
        ],
        sideEffectsRare: [
            "Réaction allergique"
        ],
        didYouKnow: "Le Cameroun a été certifié exempt de poliovirus sauvage en 2020, mais la vaccination reste essentielle pour empêcher toute réintroduction. [web:16]"
    },
    {
        name: "Pentavalent",
        description: "5 protections en une seule injection.",
        recommendedAge: 1,
        importance: "Indispensable",
        protection: "Diphtérie, Tétanos, Coqueluche, Hépatite B, Hib",
        longDescription: "Le vaccin pentavalent est un pilier du calendrier vaccinal du nourrisson au Cameroun. Il combine cinq protections en une seule injection et simplifie le suivi vaccinal tout en réduisant les visites nécessaires au centre de santé.",
        benefits: [
            "Protège contre 5 maladies importantes en une seule injection",
            "Réduit le nombre d'injections et facilite l'observance",
            "Protège contre des maladies potentiellement graves ou mortelles",
            "S'intègre parfaitement au calendrier du nourrisson"
        ],
        sideEffectsCommon: [
            "Douleur au point d'injection",
            "Rougeur locale",
            "Fièvre modérée",
            "Irritabilité"
        ],
        sideEffectsRare: [
            "Cris persistants",
            "Réaction allergique"
        ],
        didYouKnow: "Le pentavalent a remplacé plusieurs injections séparées pour améliorer la couverture vaccinale des enfants."
    },
    {
        name: "VPO 1",
        description: "Protection contre la poliomyélite à 6 semaines.",
        recommendedAge: 1,
        importance: "Indispensable",
        protection: "Poliomyélite",
        longDescription: "Le VPO 1 s'administre à partir de 6 semaines, dans le cadre du schéma de routine du nourrisson. Il renforce la protection apportée à la naissance.",
        benefits: [
            "Renforce la protection contre la poliomyélite",
            "S'inscrit dans la série de doses du nourrisson",
            "Vaccin oral simple à administrer"
        ],
        sideEffectsCommon: [
            "Aucun effet notable",
            "Légère gêne digestive transitoire"
        ],
        sideEffectsRare: [
            "Réaction allergique"
        ],
        didYouKnow: "La polio se transmet très facilement, d'où l'importance de respecter toutes les doses du calendrier."
    },
    {
        name: "Pneumocoque (PCV)",
        description: "Protection contre les infections à pneumocoque.",
        recommendedAge: 1,
        importance: "Indispensable",
        protection: "Infections à pneumocoque",
        longDescription: "Le vaccin pneumococcique protège contre plusieurs maladies bactériennes graves, notamment les pneumonies, les méningites et certaines septicémies. Il est intégré au calendrier du nourrisson dans de nombreux programmes de vaccination, dont le PEV.",
        benefits: [
            "Réduit les pneumonies graves",
            "Protège contre certaines méningites bactériennes",
            "Diminue les hospitalisations infantiles",
            "Participe à la prévention des infections invasives"
        ],
        sideEffectsCommon: [
            "Douleur au point d'injection",
            "Fièvre légère",
            "Somnolence"
        ],
        sideEffectsRare: [
            "Réaction allergique",
            "Fièvre élevée"
        ],
        didYouKnow: "Le pneumocoque est l’une des causes majeures d’infections graves chez le jeune enfant."
    },
    {
        name: "Rotavirus",
        description: "Protection contre les diarrhées sévères du nourrisson.",
        recommendedAge: 1,
        importance: "Indispensable",
        protection: "Gastro-entérite à rotavirus",
        longDescription: "Le vaccin antirotavirus protège le nourrisson contre les diarrhées aiguës sévères dues au rotavirus, une cause importante de déshydratation et d'hospitalisation chez les jeunes enfants. Il se donne très tôt dans la vie, selon le calendrier du PEV.",
        benefits: [
            "Réduit les diarrhées sévères du nourrisson",
            "Diminue le risque de déshydratation",
            "Protège contre les hospitalisations liées aux infections digestives",
            "Très utile dans les premiers mois de vie"
        ],
        sideEffectsCommon: [
            "Irritabilité",
            "Diarrhée légère",
            "Vomissements légers"
        ],
        sideEffectsRare: [
            "Douleurs abdominales importantes",
            "Réaction allergique"
        ],
        didYouKnow: "Le rotavirus est une des causes les plus fréquentes de diarrhée grave chez le jeune enfant."
    },
    {
        name: "RR (Rougeole-Rubéole)",
        description: "Double protection contre la rougeole et la rubéole.",
        recommendedAge: 9,
        importance: "Critique",
        protection: "Rougeole, Rubéole",
        longDescription: "Le vaccin RR est essentiel dans le PEV camerounais pour prévenir la rougeole et la rubéole chez l'enfant. Il contribue à réduire les flambées de rougeole et à protéger les filles et les femmes en âge de procréer contre les complications congénitales liées à la rubéole.",
        benefits: [
            "Prévient deux maladies virales importantes",
            "Réduit le risque d'épidémies de rougeole",
            "Protège contre la rubéole congénitale",
            "Renforce l'immunité collective"
        ],
        sideEffectsCommon: [
            "Légère fièvre",
            "Petite éruption cutanée passagère",
            "Douleur locale légère"
        ],
        sideEffectsRare: [
            "Gonflement des ganglions",
            "Fièvre plus marquée"
        ],
        didYouKnow: "Dans la vaccination de routine, le Cameroun utilise surtout la protection contre la rougeole et la rubéole, plutôt qu’un vaccin trivalent incluant les oreillons."
    },
    {
        name: "Fièvre Jaune",
        description: "Protection contre la fièvre jaune.",
        recommendedAge: 9,
        importance: "Obligatoire",
        protection: "Fièvre jaune",
        longDescription: "La fièvre jaune est une maladie virale transmise par les moustiques et présente un risque important au Cameroun. La vaccination est un élément majeur du PEV et elle est aussi exigée pour l'entrée des voyageurs dans le pays selon les règles de santé voyage.",
        benefits: [
            "Protection durable après une dose",
            "Réduit le risque de maladie grave et de décès",
            "Indispensable pour de nombreux voyages",
            "Très utile dans un pays où la maladie peut circuler"
        ],
        sideEffectsCommon: [
            "Légers maux de tête",
            "Douleurs musculaires",
            "Fièvre légère"
        ],
        sideEffectsRare: [
            "Réaction allergique",
            "Réaction sévère post-vaccinale très rare"
        ],
        didYouKnow: "Une seule dose est généralement considérée comme suffisante pour une protection durable, et les conseils voyage indiquent un certificat exigé pour l'entrée au Cameroun. [web:3][web:12]"
    },
    {
        name: "Vitamine A",
        description: "Supplément de prévention de la carence en vitamine A.",
        recommendedAge: 6,
        importance: "Important",
        protection: "Carence en vitamine A",
        longDescription: "La vitamine A n'est pas un vaccin, mais elle fait partie des interventions de prévention du PEV et de la santé de l'enfant. Elle est utilisée pour réduire le risque de carence, soutenir la vision et contribuer à la résistance aux infections.",
        benefits: [
            "Réduit la carence en vitamine A",
            "Soutient la croissance et la vision",
            "Renforce la santé globale de l'enfant"
        ],
        sideEffectsCommon: [
            "Nausée légère",
            "Coloration transitoire des selles"
        ],
        sideEffectsRare: [
            "Vomissements",
            "Irritabilité"
        ],
        didYouKnow: "Dans certains calendriers de santé publique, la vitamine A est administrée en complément des actions de vaccination."
    },
    {
        name: "DTC-HepB-Hib",
        description: "Protection combinée contre diphtérie, tétanos, coqueluche, hépatite B et Hib.",
        recommendedAge: 1,
        importance: "Indispensable",
        protection: "Diphtérie, Tétanos, Coqueluche, Hépatite B, Hib",
        longDescription: "Ce vaccin correspond à la formulation combinée utilisée dans plusieurs calendriers pour le nourrisson. Il est donné à partir de 6 semaines dans les structures de vaccination et protège contre plusieurs maladies sévères de l'enfance.",
        benefits: [
            "Protection large avec moins d'injections",
            "Très utile dans les premières semaines de vie",
            "Réduit le risque d'infections graves",
            "Simplifie l'application du calendrier"
        ],
        sideEffectsCommon: [
            "Douleur locale",
            "Fièvre modérée",
            "Irritabilité"
        ],
        sideEffectsRare: [
            "Cris persistants",
            "Réaction allergique"
        ],
        didYouKnow: "Dans le PEV, les vaccins combinés sont privilégiés pour améliorer la couverture et réduire la charge pour les familles."
    },
    {
        name: "Polio inactivé (VPI)",
        description: "Protection complémentaire contre la poliomyélite.",
        recommendedAge: 1,
        importance: "Indispensable",
        protection: "Poliomyélite",
        longDescription: "Le vaccin polio inactivé renforce la stratégie d'éradication de la poliomyélite en complément des doses orales. Il est utilisé dans certains calendriers pour consolider la réponse immunitaire de l’enfant.",
        benefits: [
            "Renforce la protection anti-polio",
            "Complète les doses orales",
            "Aide à maintenir l'absence de poliovirus sauvage"
        ],
        sideEffectsCommon: [
            "Douleur au point d'injection",
            "Rougeur locale",
            "Fièvre légère"
        ],
        sideEffectsRare: [
            "Réaction allergique"
        ],
        didYouKnow: "La lutte contre la poliomyélite reste une priorité de santé publique malgré les progrès accomplis. [web:16]"
    },
    {
        name: "RR 2",
        description: "Dose de rappel contre la rougeole et la rubéole.",
        recommendedAge: 12,
        importance: "Critique",
        protection: "Rougeole, Rubéole",
        longDescription: "Dans certains calendriers ou stratégies de rattrapage, une seconde dose de vaccin contenant la rougeole est utilisée pour renforcer la protection de l'enfant et améliorer la couverture immunitaire.",
        benefits: [
            "Renforce l'immunité contre la rougeole",
            "Réduit le risque d'échec vaccinal",
            "Améliore la protection collective"
        ],
        sideEffectsCommon: [
            "Fièvre légère",
            "Éruption légère",
            "Douleur locale"
        ],
        sideEffectsRare: [
            "Ganglions gonflés",
            "Réaction allergique"
        ],
        didYouKnow: "Les campagnes de suivi contre la rougeole-rubéole ciblent souvent les enfants déjà vaccinés pour augmenter l'immunité collective. [web:1]"
    },
    {
        name: "DTC",
        description: "Protection contre la diphtérie, le tétanos et la coqueluche.",
        recommendedAge: 1,
        importance: "Indispensable",
        protection: "Diphtérie, Tétanos, Coqueluche",
        longDescription: "Le vaccin DTC constitue une base importante de la protection de l'enfant. Il peut être utilisé comme composant de schémas combinés ou de rappels selon les stratégies vaccinales.",
        benefits: [
            "Protège contre trois maladies graves",
            "Réduit les formes sévères et les complications",
            "Contribue à la sécurité infantile"
        ],
        sideEffectsCommon: [
            "Douleur locale",
            "Fièvre modérée",
            "Irritabilité"
        ],
        sideEffectsRare: [
            "Cris persistants",
            "Réaction allergique"
        ],
        didYouKnow: "La coqueluche est particulièrement dangereuse chez le nourrisson, d'où l'importance du calendrier précoce."
    },
    {
        name: "VAT 1",
        description: "Première dose antitétanique pour la femme enceinte.",
        recommendedAge: 15,
        importance: "Critique",
        protection: "Tétanos maternel et néonatal",
        longDescription: "Le VAT 1 est administré dès le premier contact prénatal. Il protège la mère et surtout le nouveau-né contre le tétanos néonatal, une maladie grave évitable par la vaccination.",
        benefits: [
            "Protège le nouveau-né contre le tétanos",
            "Protège aussi la mère",
            "S'intègre au suivi prénatal"
        ],
        sideEffectsCommon: [
            "Douleur locale",
            "Rougeur légère",
            "Fatigue légère"
        ],
        sideEffectsRare: [
            "Réaction allergique"
        ],
        didYouKnow: "Le Cameroun a fait des progrès importants dans l’élimination du tétanos maternel et néonatal. [web:16]"
    },
    {
        name: "VAT 2",
        description: "Deuxième dose antitétanique.",
        recommendedAge: 15,
        importance: "Critique",
        protection: "Tétanos maternel et néonatal",
        longDescription: "Le VAT 2 est administré selon l'intervalle recommandé après la première dose pour renforcer la durée de protection contre le tétanos.",
        benefits: [
            "Renforce la protection antitétanique",
            "Augmente la durée de l'immunité",
            "Protège la grossesse en cours et la suivante"
        ],
        sideEffectsCommon: [
            "Douleur locale",
            "Rougeur légère"
        ],
        sideEffectsRare: [
            "Réaction allergique"
        ],
        didYouKnow: "Les doses antitétaniques successives sont essentielles pour obtenir une protection durable."
    },
    {
        name: "VAT 3",
        description: "Troisième dose antitétanique.",
        recommendedAge: 15,
        importance: "Critique",
        protection: "Tétanos maternel et néonatal",
        longDescription: "Le VAT 3 prolonge et consolide la protection antitétanique chez la femme enceinte ou en âge de procréer, selon le schéma de santé publique utilisé.",
        benefits: [
            "Allonge la durée de protection",
            "Réduit le risque de tétanos néonatal",
            "Sécurise davantage les grossesses futures"
        ],
        sideEffectsCommon: [
            "Douleur locale",
            "Fatigue légère"
        ],
        sideEffectsRare: [
            "Réaction allergique"
        ],
        didYouKnow: "La protection du nouveau-né dépend en grande partie du statut vaccinal maternel."
    },
    {
        name: "VAT 4",
        description: "Quatrième dose antitétanique.",
        recommendedAge: 15,
        importance: "Critique",
        protection: "Tétanos maternel et néonatal",
        longDescription: "Le VAT 4 poursuit l’accumulation de la protection antitétanique au fil des grossesses et du suivi prénatal.",
        benefits: [
            "Protection prolongée",
            "Contribue à l'élimination du tétanos néonatal",
            "Renforce la couverture des femmes"
        ],
        sideEffectsCommon: [
            "Douleur locale",
            "Rougeur légère"
        ],
        sideEffectsRare: [
            "Réaction allergique"
        ],
        didYouKnow: "Les rappels antitétaniques font partie des gestes simples les plus efficaces en santé maternelle."
    },
    {
        name: "VAT 5",
        description: "Cinquième dose antitétanique.",
        recommendedAge: 15,
        importance: "Critique",
        protection: "Tétanos maternel et néonatal",
        longDescription: "Le VAT 5 complète le schéma de protection antitétanique chez la femme en âge de procréer, avec une protection de très longue durée.",
        benefits: [
            "Assure une protection très durable",
            "Réduit quasiment à long terme le risque de tétanos maternel et néonatal",
            "Clôture le schéma de base"
        ],
        sideEffectsCommon: [
            "Douleur locale",
            "Fatigue légère"
        ],
        sideEffectsRare: [
            "Réaction allergique"
        ],
        didYouKnow: "Une fois le schéma complet reçu, la protection antitétanique peut durer très longtemps."
    }
]
async function main() {
    console.log(`Start seeding vaccines...`)
    for (const v of vaccines) {
        const existing = await prisma.vaccine.findFirst({
            where: { name: v.name }
        })

        const vaccineData = {
            name: v.name,
            description: v.description,
            recommendedAge: v.recommendedAge,
            importance: v.importance,
            protection: v.protection,
            longDescription: v.longDescription,
            benefits: v.benefits,
            sideEffectsCommon: v.sideEffectsCommon,
            sideEffectsRare: v.sideEffectsRare,
            didYouKnow: v.didYouKnow,
            fullProtectionList: (v as any).fullProtectionList || [],
        }

        if (existing) {
            await prisma.vaccine.update({
                where: { id: existing.id },
                data: vaccineData
            })
            console.log(`Updated vaccine: ${v.name}`)
        } else {
            await prisma.vaccine.create({
                data: vaccineData,
            })
            console.log(`Created vaccine: ${v.name}`)
        }
    }
    console.log(`Seeding finished.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
