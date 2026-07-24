import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getSessionUserId } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

function normalizePhone(value: unknown) {
  return typeof value === "string" ? value.replace(/\s+/g, "").trim() : "";
}
export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = getSessionUserId(session);
  if (!userId) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      phone: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "Profil introuvable" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = getSessionUserId(session);
  if (!userId) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const phone = normalizePhone(body.phone);

    if (name.length < 2) {
      return NextResponse.json(
        { message: "Le nom doit contenir au moins 2 caractères." },
        { status: 400 },
      );
    }
    if (phone.length < 8) {
      return NextResponse.json(
        { message: "Saisissez un numéro de téléphone valide." },
        { status: 400 },
      );
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, phone },
      select: {
        id: true,
        name: true,
        phone: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("PATCH /api/profile:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "Ce numéro de téléphone est déjà utilisé." },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { message: "Impossible de mettre à jour le profil." },
      { status: 500 },
    );
  }
}
