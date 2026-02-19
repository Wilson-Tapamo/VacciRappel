import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const vaccines = [
    {
        name: "BCG",
        description: "Protection contre la tuberculose. Administré à la naissance par voie intradermique.",
        recommendedAge: 0,
        importance: "Fondamental",
        protection: "Tuberculose"
    },
    {
        name: "VPO 0",
        description: "Vaccin Polio Oral. Protection contre la poliomyélite.",
        recommendedAge: 0,
        importance: "Indispensable",
        protection: "Poliomyélite"
    },
    {
        name: "Pentavalent 1",
        description: "Combine la protection contre la Diphtérie, le Tétanos, la Coqueluche, l'Hépatite B et l'Haemophilus influenzae type b.",
        recommendedAge: 1, // 6 weeks ~ 1.5 months
        importance: "Critique",
        protection: "Diphtérie, Tétanos, Coqueluche, Hépatite B, Hib"
    },
    {
        name: "PCV13-1",
        description: "Vaccin contre les infections à pneumocoques (pneumonie, méningite).",
        recommendedAge: 1,
        importance: "Élevé",
        protection: "Pneumocoque"
    },
    {
        name: "Rota-1",
        description: "Protection contre les gastro-entérites graves à Rotavirus.",
        recommendedAge: 1,
        importance: "Élevé",
        protection: "Rotavirus"
    },
    {
        name: "Pentavalent 2",
        description: "Deuxième dose du Pentavalent.",
        recommendedAge: 2, // 10 weeks ~ 2.5 months
        importance: "Critique",
        protection: "Diphtérie, Tétanos, Coqueluche, Hépatite B, Hib"
    },
    {
        name: "PCV13-2",
        description: "Deuxième dose contre le pneumocoque.",
        recommendedAge: 2,
        importance: "Élevé",
        protection: "Pneumocoque"
    },
    {
        name: "Rota-2",
        description: "Deuxième dose contre le Rotavirus.",
        recommendedAge: 2,
        importance: "Élevé",
        protection: "Rotavirus"
    },
    {
        name: "Pentavalent 3",
        description: "Troisième dose du Pentavalent.",
        recommendedAge: 3, // 14 weeks ~ 3.5 months
        importance: "Critique",
        protection: "Diphtérie, Tétanos, Coqueluche, Hépatite B, Hib"
    },
    {
        name: "PCV13-3",
        description: "Troisième dose contre le pneumocoque.",
        recommendedAge: 3,
        importance: "Élevé",
        protection: "Pneumocoque"
    },
    {
        name: "VPO-3",
        description: "Troisième dose du Vaccin Polio Oral.",
        recommendedAge: 3,
        importance: "Indispensable",
        protection: "Poliomyélite"
    },
    {
        name: "ROR 1",
        description: "Rougeole-Oreillons-Rubéole. Première dose.",
        recommendedAge: 9,
        importance: "Élevé",
        protection: "Rougeole, Oreillons, Rubéole"
    },
    {
        name: "Fièvre Jaune",
        description: "Vaccination contre la fièvre jaune. Une dose assure souvent une protection à vie.",
        recommendedAge: 9,
        importance: "Obligatoire",
        protection: "Fièvre Jaune"
    },
    {
        name: "Paludisme (RTS,S)",
        description: "Protection contre le paludisme. Introduit pour les enfants à partir de 6 mois.",
        recommendedAge: 6,
        importance: "Nouveau / Essentiel",
        protection: "Paludisme"
    }
]

async function main() {
    console.log(`Start seeding vaccines...`)
    for (const v of vaccines) {
        const existing = await prisma.vaccine.findFirst({
            where: { name: v.name }
        })

        if (existing) {
            await prisma.vaccine.update({
                where: { id: existing.id },
                data: {
                    description: v.description,
                    recommendedAge: v.recommendedAge,
                }
            })
            console.log(`Updated vaccine: ${v.name}`)
        } else {
            await prisma.vaccine.create({
                data: {
                    name: v.name,
                    description: v.description,
                    recommendedAge: v.recommendedAge,
                },
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
