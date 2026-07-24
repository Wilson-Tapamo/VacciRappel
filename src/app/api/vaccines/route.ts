import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const preciseVaccines = await prisma.vaccine.findMany({
            where: { recommendedAgeDays: { not: null } },
            orderBy: [
                { recommendedAgeDays: "asc" },
                { seriesCode: "asc" },
                { doseNumber: "asc" },
            ],
        });
        const vaccines = preciseVaccines.length > 0
            ? preciseVaccines.filter((vaccine) => {
                const rules = vaccine.eligibilityRules as { schedule?: string } | null;
                return ["ROUTINE", "TARGETED", "ADOLESCENT"].includes(rules?.schedule || "");
            })
            : await prisma.vaccine.findMany({ orderBy: { recommendedAge: "asc" } });
        const response = NextResponse.json(vaccines);
        response.headers.set('Cache-Control', 'no-store, max-age=0');
        return response;
    } catch (error: unknown) {
        console.error("API /api/vaccines error:", error);
        return NextResponse.json(
            {
                message: "Erreur serveur",
                error: error instanceof Error ? error.message : "Erreur inconnue",
            },
            { status: 500 },
        );
    }
}
