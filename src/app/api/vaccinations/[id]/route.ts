import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    try {
        const { status } = await req.json();
        const { id } = await params;

        // Verify the record belongs to a child owned by this user
        const record = await prisma.vaccinationRecord.findUnique({
            where: { id },
            include: {
                child: true
            }
        });

        if (!record || record.child.userId !== (session.user as any).id) {
            return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
        }

        const updatedRecord = await prisma.vaccinationRecord.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json(updatedRecord);
    } catch (error) {
        console.error("PATCH /api/vaccinations error:", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}
