import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getSessionUserId } from "@/lib/auth-user";
import { getChildAccess } from "@/lib/child-access";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const userId = getSessionUserId(session);
  if (!userId) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const body = await req.json();
    const { id } = await params;
    const access = await getChildAccess(userId, id);
    if (!access) return NextResponse.json({ message: "Enfant non trouvé" }, { status: 404 });
    if (!access.canEdit) return NextResponse.json({ message: "Accès en lecture seule" }, { status: 403 });

    if (!body.force && typeof body.baseVersion === "number" && body.baseVersion !== access.child.version) {
      return NextResponse.json(
        { message: "Le profil a été modifié sur un autre appareil.", server: access.child },
        { status: 409 },
      );
    }

    const result = await prisma.child.updateMany({
      where: body.force || typeof body.baseVersion !== "number"
        ? { id }
        : { id, version: body.baseVersion },
      data: {
        name: body.name,
        birthDate: body.birthDate ? new Date(body.birthDate) : undefined,
        gender: body.gender,
        image: body.image,
        bloodGroup: body.bloodGroup,
        allergies: body.allergies,
        conditions: body.conditions,
        medicalInfo: body.medicalInfo,
        version: { increment: 1 },
      },
    });
    if (!result.count) {
      const server = await prisma.child.findUnique({ where: { id } });
      return NextResponse.json({ message: "Conflit de synchronisation.", server }, { status: 409 });
    }
    return NextResponse.json(await prisma.child.findUniqueOrThrow({ where: { id } }));
  } catch (error) {
    console.error("PATCH /api/children/[id]:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
