import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_DECISIONS = ["approved", "rejected", "escalated"];

export async function POST(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const body = await req.json();

        const { decision, rationale, reviewerId, expiresAt } = body;

        if (!VALID_DECISIONS.includes(decision)) {
            return NextResponse.json(
                { error: "Invalid decision." },
                { status: 400 }
            );
        }

        if (!rationale || rationale.trim().length < 5) {
            return NextResponse.json(
                { error: "Rationale is required." },
                { status: 400 }
            );
        }

        const review = await prisma.review.update({
            where: { id },
            data: {
                decision,
                rationale,
                reviewerId,
                decidedAt: new Date(),
                expiresAt: expiresAt ? new Date(expiresAt) : null,
            },
        });

        return NextResponse.json({ review });
    } catch {
        return NextResponse.json(
            { error: "Failed to save decision." },
            { status: 500 }
        );
    }
}