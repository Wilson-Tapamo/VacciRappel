import { NextResponse } from "next/server";
import { deliverReminder } from "@/lib/reminder-delivery";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  const due = await prisma.reminderDelivery.findMany({
    where: { status: "PENDING", scheduledFor: { lte: new Date() } },
    select: { id: true },
    orderBy: { scheduledFor: "asc" },
    take: 100,
  });
  let sent = 0;
  let failed = 0;
  for (const item of due) {
    try {
      await deliverReminder(item.id);
      await prisma.reminderDelivery.update({
        where: { id: item.id },
        data: { status: "SENT", sentAt: new Date(), error: null },
      });
      sent += 1;
    } catch (error) {
      await prisma.reminderDelivery.update({
        where: { id: item.id },
        data: { status: "FAILED", error: error instanceof Error ? error.message.slice(0, 500) : "Erreur inconnue" },
      });
      failed += 1;
    }
  }
  return NextResponse.json({ processed: due.length, sent, failed });
}
