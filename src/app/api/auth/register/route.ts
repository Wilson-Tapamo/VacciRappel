import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { name, phone, password } = await req.json();

        if (!name || !phone || !password) {
            return NextResponse.json(
                { message: "Champs manquants" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { phone },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "Cet utilisateur existe déjà" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                name,
                phone,
                password: hashedPassword,
            },
        });

        return NextResponse.json(
            { message: "Utilisateur créé avec succès", userId: user.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erreur d'inscription:", error);
        return NextResponse.json(
            { message: "Une erreur est survenue lors de l'inscription" },
            { status: 500 }
        );
    }
}
