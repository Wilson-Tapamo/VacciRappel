import { createHash, randomBytes } from "node:crypto";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getSessionUserId } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const userId = getSessionUserId(await getServerSession(authOptions));
  if (!userId) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const body = await request.json();
  const child = await prisma.child.findFirst({ where: { id: body.childId, userId } });
  if (!child) return NextResponse.json({ message: "Seul le propriétaire peut partager ce carnet." }, { status: 403 });

  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const invite = await prisma.familyInvite.create({
    data: {
      childId: child.id,
      createdById: userId,
      tokenHash,
      role: body.role === "VIEWER" ? "VIEWER" : "CAREGIVER",
      expiresAt: new Date(Date.now() + 7 * 86_400_000),
    },
  });
  const origin = new URL(request.url).origin;
  return NextResponse.json({
    id: invite.id,
    expiresAt: invite.expiresAt,
    link: `${origin}/family/accept?token=${encodeURIComponent(token)}`,
  });
}
