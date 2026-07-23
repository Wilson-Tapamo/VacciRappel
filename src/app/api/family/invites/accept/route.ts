import { createHash } from "node:crypto";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getSessionUserId } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const userId = getSessionUserId(await getServerSession(authOptions));
  if (!userId) return NextResponse.json({ message: "Connectez-vous pour accepter l’invitation." }, { status: 401 });
  const { token } = await request.json();
  const tokenHash = createHash("sha256").update(String(token || "")).digest("hex");
  const invite = await prisma.familyInvite.findUnique({ where: { tokenHash }, include: { child: true } });
  if (!invite || invite.usedAt || invite.expiresAt < new Date()) {
    return NextResponse.json({ message: "Cette invitation est invalide ou expirée." }, { status: 410 });
  }
  if (invite.child.userId === userId) {
    return NextResponse.json({ message: "Vous êtes déjà propriétaire de ce carnet." }, { status: 400 });
  }
  await prisma.$transaction([
    prisma.familyAccess.upsert({
      where: { childId_userId: { childId: invite.childId, userId } },
      update: { role: invite.role },
      create: { childId: invite.childId, userId, role: invite.role },
    }),
    prisma.familyInvite.update({ where: { id: invite.id }, data: { usedAt: new Date() } }),
  ]);
  return NextResponse.json({ ok: true, childName: invite.child.name });
}
