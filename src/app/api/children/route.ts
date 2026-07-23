import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getSessionUserId } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";
import { evaluateVaccineEligibility } from "@/lib/vaccine-eligibility";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = getSessionUserId(session);
  if (!userId) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const children = await prisma.child.findMany({
      where: {
        OR: [{ userId }, { familyAccess: { some: { userId } } }],
      },
      include: {
        vaccinations: { include: { vaccine: true } },
        growthRecords: { orderBy: { date: "asc" } },
        familyAccess: { where: { userId }, select: { role: true } },
      },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(children.map((child) => ({
      ...child,
      vaccinations: child.vaccinations.map((record) => ({
        ...record,
        eligibility: evaluateVaccineEligibility(child.birthDate, record, child.vaccinations),
      })),
    })));
  } catch {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = getSessionUserId(session);
  if (!userId) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const body = await req.json();
    const birthDate = new Date(body.birthDate);
    const child = await prisma.child.create({
      data: {
        name: body.name,
        birthDate,
        gender: body.gender,
        image: body.image,
        bloodGroup: body.bloodGroup,
        allergies: body.allergies,
        conditions: body.conditions,
        medicalInfo: body.medicalInfo,
        medicalBookletScan: body.medicalBookletScan,
        userId,
      },
    });

    const vaccines = await prisma.vaccine.findMany();
    const preciseScheduleAvailable = vaccines.some((vaccine) => vaccine.recommendedAgeDays !== null);
    const records = vaccines
      .filter((vaccine) => !preciseScheduleAvailable || vaccine.recommendedAgeDays !== null)
      .map((vaccine) => {
        const date = new Date(birthDate);
        if (vaccine.recommendedAgeDays !== null) {
          date.setUTCDate(date.getUTCDate() + vaccine.recommendedAgeDays);
        } else {
          date.setUTCMonth(date.getUTCMonth() + vaccine.recommendedAge);
        }
        return { childId: child.id, vaccineId: vaccine.id, status: "PENDING", date };
      });
    if (records.length) await prisma.vaccinationRecord.createMany({ data: records });

    return NextResponse.json(child, { status: 201 });
  } catch (error) {
    console.error("POST /api/children:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
