import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const vaccines = [
    {
        name: "BCG",
        description: "Protection contre la tuberculose.",
        recommendedAge: 0,
        importance: "Fondamental",
        protection: "Tuberculose",
        longDescription: "Le BCG est crucial au Cameroun pour protéger les nouveau-nés contre les formes graves de tuberculose. Il est administré gratuitement dans tous les centres de santé publique dès la naissance.",
        benefits: [
            "Prévient les formes graves de tuberculose chez l'enfant",
            "Protection efficace dès la naissance",
            "Sûr et mondialement reconnu"
        ],
        sideEffectsCommon: ["Petite cicatrice au point d'injection", "Légère rougeur"],
        sideEffectsRare: ["Légère fièvre"],
        didYouKnow: "La tuberculose reste une préoccupation majeure de santé publique, et la vaccination précoce est la meilleure arme de prévention."
    },
    {
        name: "ROR (Rougeole-Oreillons-Rubéole)",
        description: "Triple protection contre la rougeole, les oreillons et la rubéole.",
        recommendedAge: 9,
        importance: "Critique",
        protection: "Rougeole, Oreillons, Rubéole",
        longDescription: "Le vaccin ROR est essentiel au Cameroun où des épidémies de rougeole peuvent survenir. Il fait partie du programme national de vaccination et protège contre des complications graves comme la pneumonie et l'encéphalite.",
        benefits: [
            "Prévient les maladies infantiles graves",
            "Protège la communauté grâce à l'immunité collective",
            "Une seule injection offre une triple protection",
            "Efficace à 97% pour prévenir la rougeole"
        ],
        sideEffectsCommon: ["Légère fièvre", "Petite éruption cutanée passagère"],
        sideEffectsRare: ["Gonflement des ganglions"],
        didYouKnow: "La rougeole est l'une des principales causes de décès chez les jeunes enfants dans le monde, mais le vaccin ROR est extrêmement efficace pour la prévenir.",
        fullProtectionList: [
            { name: "Rougeole", description: "Infection virale très contagieuse causant fièvre et éruption cutanée", icon: "🦠" },
            { name: "Oreillons", description: "Infection virale affectant les glandes salivaires", icon: "😷" },
            { name: "Rubéole", description: "Rougeole allemande, peut causer de graves malformations congénitales", icon: "🌡️" }
        ]
    },
    {
        name: "Pentavalent",
        description: "5 protections en une seule injection.",
        recommendedAge: 1, // 6 weeks
        importance: "Indispensable",
        protection: "Diphtérie, Tétanos, Coqueluche, Hépatite B, Hib",
        longDescription: "Le Pentavalent simplifie le calendrier vaccinal en protégeant contre 5 maladies majeures. Il est indispensable pour la survie et le bon développement de l'enfant au Cameroun.",
        benefits: [
            "Protection globale contre 5 maladies",
            "Réduit le nombre d'injections nécessaires",
            "Prévient les infections respiratoires et hépatiques"
        ],
        sideEffectsCommon: ["Douleur au point d'injection", "Fièvre modérée"],
        sideEffectsRare: ["Cris persistants"],
        didYouKnow: "Avant l'introduction du Pentavalent, les enfants devaient recevoir plusieurs injections séparées pour ces mêmes maladies."
    },
    {
        name: "Fièvre Jaune",
        description: "Protection contre la fièvre jaune.",
        recommendedAge: 9,
        importance: "Obligatoire",
        protection: "Fièvre jaune",
        longDescription: "La fièvre jaune est endémique dans certaines régions. La vaccination est obligatoire pour tous et souvent exigée pour les voyages internationaux.",
        benefits: [
            "Protection à vie avec une seule dose",
            "Indispensable pour voyager en toute sécurité",
            "Prévient une maladie aux conséquences souvent fatales"
        ],
        sideEffectsCommon: ["Légers maux de tête", "Douleurs musculaires"],
        sideEffectsRare: ["Réaction allergique"],
        didYouKnow: "Une dose unique est suffisante pour conférer une immunité protectrice à vie contre la maladie."
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
            fullProtectionList: v.fullProtectionList || [],
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
