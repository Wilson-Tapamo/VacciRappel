import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    try {
        const { weight, height, date } = await req.json();
        const { id: childId } = await params;

        // Verify child belongs to user
        const existingChild = await prisma.child.findFirst({
            where: {
                id: childId,
                userId: (session.user as any).id,
            },
        });

        if (!existingChild) {
            return NextResponse.json({ message: "Enfant non trouvé" }, { status: 404 });
        }

        const growthRecord = await prisma.growthRecord.create({
            data: {
                childId,
                weight: weight ? parseFloat(weight) : null,
                height: height ? parseFloat(height) : null,
                date: date ? new Date(date) : new Date(),
            },
        });

        return NextResponse.json(growthRecord, { status: 201 });
    } catch (error) {
        console.error("Failed to add growth record", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}
