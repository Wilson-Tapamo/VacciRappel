import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getSessionUserId } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = getSessionUserId(await getServerSession(authOptions));
  if (!userId) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const appointment = await prisma.vaccinationAppointment.findFirst({
    where: { id, child: { OR: [{ userId }, { familyAccess: { some: { userId } } }] } },
  });
  if (!appointment) return NextResponse.json({ message: "Rendez-vous introuvable" }, { status: 404 });

  const preference = await prisma.reminderPreference.findUnique({ where: { userId } });
  const channels = [
    preference?.pushEnabled !== false && "PUSH",
    preference?.smsEnabled && "SMS",
    preference?.whatsappEnabled && "WHATSAPP",
  ].filter(Boolean) as string[];
  const days = preference?.reminderDaysBefore?.length ? preference.reminderDaysBefore : [7, 2, 0];

  const updated = await prisma.$transaction(async (tx) => {
    const confirmed = await tx.vaccinationAppointment.update({
      where: { id },
      data: { status: "CONFIRMED", confirmedAt: new Date(), version: { increment: 1 } },
    });
    const deliveries = channels.flatMap((channel) =>
      days.map((daysBefore) => ({
        appointmentId: id,
        userId,
        channel,
        scheduledFor: new Date(appointment.scheduledFor.getTime() - daysBefore * 86_400_000),
      })),
    ).filter((delivery) => delivery.scheduledFor > new Date());
    if (deliveries.length) {
      await tx.reminderDelivery.createMany({ data: deliveries, skipDuplicates: true });
    }
    return confirmed;
  });
  return NextResponse.json(updated);
}
