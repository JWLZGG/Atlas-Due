import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEMO_API_KEY = "atlas_due_demo_key";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const {
            recipientAddress,
            counterpartyLabel,
            asset,
            amount,
            purpose,
            analysis,
            decision,
            rationale,
            expiresAt,
        } = body;

        if (
            !recipientAddress ||
            !counterpartyLabel ||
            !asset ||
            !amount ||
            !purpose
        ) {
            return NextResponse.json(
                { error: "Payment context is incomplete." },
                { status: 400 }
            );
        }

        if (!analysis) {
            return NextResponse.json(
                { error: "Analysis evidence is required." },
                { status: 400 }
            );
        }

        if (
            !["approved", "rejected", "escalated"].includes(decision)
        ) {
            return NextResponse.json(
                { error: "A valid review decision is required." },
                { status: 400 }
            );
        }

        if (!rationale?.trim()) {
            return NextResponse.json(
                { error: "Reviewer rationale is required." },
                { status: 400 }
            );
        }

        if (decision === "approved" && !expiresAt) {
            return NextResponse.json(
                { error: "Approved reviews require an expiry date." },
                { status: 400 }
            );
        }

        const workspace = await prisma.workspace.findUnique({
            where: {
                apiKey: DEMO_API_KEY,
            },
        });

        if (!workspace) {
            return NextResponse.json(
                { error: "Demo workspace was not found." },
                { status: 500 }
            );
        }

        const now = new Date();

        const review = await prisma.review.create({
            data: {
                workspaceId: workspace.id,

                chain: "solana",
                recipientAddress,
                counterpartyLabel,
                asset,
                amount,
                purpose,

                evidenceJson: JSON.stringify(analysis),
                evidenceCheckedAt: now,
                evidenceSource: "atlas-due-analysis-v1",

                decision,
                rationale: rationale.trim(),

                reviewerId: "demo-reviewer",
                decidedAt: now,

                expiresAt:
                    decision === "approved" && expiresAt
                        ? new Date(`${expiresAt}T23:59:59.999Z`)
                        : null,

                policyVersion: "pilot-1",
            },
        });

        return NextResponse.json(
            {
                review: {
                    id: review.id,
                    recipientAddress: review.recipientAddress,
                    counterpartyLabel: review.counterpartyLabel,
                    asset: review.asset,
                    amount: review.amount,
                    purpose: review.purpose,
                    decision: review.decision,
                    rationale: review.rationale,
                    reviewerId: review.reviewerId,
                    decidedAt: review.decidedAt.toISOString(),
                    expiresAt: review.expiresAt?.toISOString() ?? null,
                    policyVersion: review.policyVersion,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Failed to save review:", error);

        return NextResponse.json(
            { error: "Failed to save review." },
            { status: 500 }
        );
    }
}