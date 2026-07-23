import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getSessionUserId } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const userId = getSessionUserId(await getServerSession(authOptions));
  if (!userId) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const appointments = await prisma.vaccinationAppointment.findMany({
    where: {
      child: { OR: [{ userId }, { familyAccess: { some: { userId } } }] },
      scheduledFor: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
    include: {
      child: { select: { name: true } },
      vaccine: { select: { name: true, doseNumber: true } },
      facility: { select: { name: true, phone: true } },
    },
    orderBy: { scheduledFor: "asc" },
    take: 20,
  });
  return NextResponse.json(appointments);
}

export async function POST(request: Request) {
  const userId = getSessionUserId(await getServerSession(authOptions));
  if (!userId) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const body = await request.json();
  const scheduledFor = new Date(body.scheduledFor);
  if (Number.isNaN(scheduledFor.getTime())) {
    return NextResponse.json({ message: "Date invalide" }, { status: 400 });
  }
  const child = await prisma.child.findFirst({
    where: { id: body.childId, OR: [{ userId }, { familyAccess: { some: { userId, role: { not: "VIEWER" } } } }] },
  });
  if (!child) return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
  const appointment = await prisma.vaccinationAppointment.create({
    data: {
      childId: child.id,
      vaccineId: body.vaccineId || null,
      facilityId: body.facilityId || null,
      scheduledFor,
      status: "PROPOSED",
    },
  });
  return NextResponse.json(appointment, { status: 201 });
}
