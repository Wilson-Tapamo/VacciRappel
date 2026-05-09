import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const vaccines = await prisma.vaccine.findMany();
        const response = NextResponse.json(vaccines);
        response.headers.set('Cache-Control', 'no-store, max-age=0');
        return response;
    } catch (error: any) {
        console.error("API /api/vaccines error:", error);
        return NextResponse.json({ message: "Erreur serveur", error: error.message }, { status: 500 });
    }
}
