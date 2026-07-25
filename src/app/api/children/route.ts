import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getSessionUserId } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";
import { evaluateVaccineEligibility } from "@/lib/vaccine-eligibility";
import { Prisma } from "@prisma/client";
import { planChildVaccinations } from "@/lib/vaccination-schedule";

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
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const birthDate = new Date(body.birthDate);
    const today = new Date();
    const completedVaccineCodes = Array.isArray(body.completedVaccineCodes)
      ? body.completedVaccineCodes.filter(
        (code: unknown): code is string => typeof code === "string",
      )
      : [];
    if (!name || Number.isNaN(birthDate.getTime())) {
      return NextResponse.json(
        { message: "Le nom et la date de naissance sont requis." },
        { status: 400 },
        );
    }
    if (birthDate > today) {
      return NextResponse.json(
        { message: "La date de naissance ne peut pas être dans le futur." },
        { status: 400 },
      );
    }

    const child = await prisma.$transaction(async (transaction) => {
      const createdChild = await transaction.child.create({
        data: {
          name,
          birthDate,
          gender: body.gender === "F" ? "F" : "M",
          image: body.image || null,
          bloodGroup: body.bloodGroup || null,
          allergies: body.allergies || null,
          conditions: body.conditions || null,
          medicalInfo: body.medicalInfo || null,
          medicalBookletScan: body.medicalBookletScan || null,
          userId,
        },
      });

      const vaccines = await transaction.vaccine.findMany();
      const plan = planChildVaccinations({
        vaccines,
        birthDate,
        completedVaccineCodes,
        today,
      });
      if (plan.records.length) {
        await transaction.vaccinationRecord.createMany({
          data: plan.records.map((record) => ({
            ...record,
            childId: createdChild.id,
          })),
        });
      }
      return {
        ...createdChild,
        scheduleMode: plan.mode,
      };
    });

    return NextResponse.json(child, { status: 201 });
  } catch (error) {
    console.error("POST /api/children:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2022"
    ) {
      return NextResponse.json(
        {
          message:
            "La base de données doit être mise à jour avant d’ajouter un enfant.",
          code: "DATABASE_SCHEMA_OUTDATED",
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
