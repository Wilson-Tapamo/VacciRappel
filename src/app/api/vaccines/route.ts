import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const vaccines = await prisma.vaccine.findMany();
        return NextResponse.json(vaccines);
    } catch (error: any) {
        console.error("API /api/vaccines error:", error);
        return NextResponse.json({ message: "Erreur serveur", error: error.message }, { status: 500 });
    }
}
