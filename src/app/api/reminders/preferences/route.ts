import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getSessionUserId } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const userId = getSessionUserId(await getServerSession(authOptions));
  if (!userId) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const preference = await prisma.reminderPreference.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
  return NextResponse.json(preference);
}

export async function PUT(request: Request) {
  const userId = getSessionUserId(await getServerSession(authOptions));
  if (!userId) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const body = await request.json();
  const reminderDaysBefore = Array.isArray(body.reminderDaysBefore)
    ? body.reminderDaysBefore.filter((value: unknown) => Number.isInteger(value) && Number(value) >= 0).slice(0, 5)
    : [7, 2, 0];
  const preference = await prisma.reminderPreference.upsert({
    where: { userId },
    update: {
      pushEnabled: Boolean(body.pushEnabled),
      smsEnabled: Boolean(body.smsEnabled),
      whatsappEnabled: Boolean(body.whatsappEnabled),
      reminderDaysBefore,
      quietHoursStart: body.quietHoursStart || null,
      quietHoursEnd: body.quietHoursEnd || null,
    },
    create: {
      userId,
      pushEnabled: Boolean(body.pushEnabled),
      smsEnabled: Boolean(body.smsEnabled),
      whatsappEnabled: Boolean(body.whatsappEnabled),
      reminderDaysBefore,
      quietHoursStart: body.quietHoursStart || null,
      quietHoursEnd: body.quietHoursEnd || null,
    },
  });
  return NextResponse.json(preference);
}
