import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    try {
        const { name, birthDate, gender, image, medicalInfo } = await req.json();
        const childId = params.id;

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

        const updatedChild = await prisma.child.update({
            where: { id: childId },
            data: {
                name,
                birthDate: birthDate ? new Date(birthDate) : undefined,
                gender,
                image,
                medicalInfo,
            },
        });

        return NextResponse.json(updatedChild);
    } catch (error) {
        console.error("Failed to update child", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}
