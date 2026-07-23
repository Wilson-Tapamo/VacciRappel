import { readFile } from "node:fs/promises";
import path from "node:path";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getSessionUserId } from "@/lib/auth-user";
import { getChildAccess } from "@/lib/child-access";
import { prisma } from "@/lib/prisma";
import { createVaccinationPdf } from "@/lib/vaccination-pdf";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = getSessionUserId(await getServerSession(authOptions));
  if (!userId) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const access = await getChildAccess(userId, id);
  if (!access) return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
  const child = await prisma.child.findUniqueOrThrow({
    where: { id },
    include: {
      vaccinations: { include: { vaccine: true }, orderBy: { date: "asc" } },
    },
  });
  let logo: Uint8Array | undefined;
  try {
    logo = await readFile(path.join(process.cwd(), "public", "icons", "icon-192.png"));
  } catch {
    logo = undefined;
  }
  const origin = new URL(request.url).origin;
  const bytes = await createVaccinationPdf({
    child,
    records: child.vaccinations,
    verificationUrl: `${origin}/profile?child=${encodeURIComponent(child.id)}`,
    logo,
  });
  const safeName = child.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="carnet-vaccinal-${safeName}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
