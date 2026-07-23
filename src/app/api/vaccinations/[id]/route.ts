import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getSessionUserId } from "@/lib/auth-user";
import { getChildAccess } from "@/lib/child-access";
import { prisma } from "@/lib/prisma";
import { evaluateVaccineEligibility } from "@/lib/vaccine-eligibility";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const userId = getSessionUserId(session);
  if (!userId) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const body = await req.json();
    const { id } = await params;
    const record = await prisma.vaccinationRecord.findUnique({
      where: { id },
      include: {
        vaccine: true,
        child: { include: { vaccinations: { include: { vaccine: true } } } },
      },
    });
    if (!record) return NextResponse.json({ message: "Dose introuvable" }, { status: 404 });

    const access = await getChildAccess(userId, record.childId);
    if (!access?.canEdit) return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
    if (body.status === "DONE") {
      const eligibility = evaluateVaccineEligibility(record.child.birthDate, record, record.child.vaccinations);
      if (!eligibility.eligible) {
        return NextResponse.json(
          { message: "Cette dose n’est pas encore éligible.", eligibility },
          { status: 422 },
        );
      }
    }
    if (!body.force && typeof body.baseVersion === "number" && body.baseVersion !== record.version) {
      return NextResponse.json(
        { message: "Cette dose a été modifiée sur un autre appareil.", server: record },
        { status: 409 },
      );
    }

    const result = await prisma.vaccinationRecord.updateMany({
      where: body.force || typeof body.baseVersion !== "number"
        ? { id }
        : { id, version: body.baseVersion },
      data: {
        status: body.status,
        completedAt: body.status === "DONE" ? new Date() : null,
        version: { increment: 1 },
      },
    });
    if (!result.count) {
      const server = await prisma.vaccinationRecord.findUnique({ where: { id } });
      return NextResponse.json({ message: "Conflit de synchronisation.", server }, { status: 409 });
    }
    return NextResponse.json(await prisma.vaccinationRecord.findUniqueOrThrow({ where: { id } }));
  } catch (error) {
    console.error("PATCH /api/vaccinations/[id]:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
