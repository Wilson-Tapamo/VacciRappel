import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    try {
        const children = await prisma.child.findMany({
            where: { userId: (session.user as any).id },
            include: {
                vaccinations: {
                    include: { vaccine: true }
                }
            }
        });

        return NextResponse.json(children);
    } catch (error) {
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    try {
        const { name, birthDate, gender, image, medicalInfo, medicalBookletScan } = await req.json();

        const child = await prisma.child.create({
            data: {
                name,
                birthDate: new Date(birthDate),
                gender,
                image,
                medicalInfo,
                medicalBookletScan,
                userId: (session.user as any).id,
            },
        });

        // Automatically schedule vaccinations
        const allVaccines = await prisma.vaccine.findMany();

        if (allVaccines.length > 0) {
            const birthDateObj = new Date(birthDate);
            const vaccinationRecords = allVaccines.map(vaccine => {
                const scheduledDate = new Date(birthDateObj);
                scheduledDate.setMonth(scheduledDate.getMonth() + vaccine.recommendedAge);

                return {
                    childId: child.id,
                    vaccineId: vaccine.id,
                    status: "PENDING",
                    date: scheduledDate,
                };
            });

            await prisma.vaccinationRecord.createMany({
                data: vaccinationRecords,
            });
        }

        return NextResponse.json(child, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}
