import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const reviews = await prisma.review.findMany({
            orderBy: {
                updatedAt: "desc",
            },
            take: 50,
        });

        return NextResponse.json({ reviews });
    } catch (error) {
        console.error("Failed to fetch registry:", error);

        return NextResponse.json(
            { error: "Failed to fetch registry." },
            { status: 500 }
        );
    }
}