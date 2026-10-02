import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const auth = req.headers.get("authorization");
        const token = auth?.replace("Bearer ", "");

        if (!token) {
            return NextResponse.json(
                {
                    status: "review_required",
                    reason: "Missing workspace API key",
                },
                { status: 401 }
            );
        }

        const workspace = await prisma.workspace.findUnique({
            where: { apiKey: token },
        });

        if (!workspace) {
            return NextResponse.json(
                {
                    status: "review_required",
                    reason: "Invalid workspace API key",
                },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { chain, recipientAddress, asset, purpose } = body;

        if (!chain || !recipientAddress || !asset || !purpose) {
            return NextResponse.json(
                {
                    status: "review_required",
                    reason: "Missing required precheck fields",
                },
                { status: 400 }
            );
        }

        const latestReview = await prisma.review.findFirst({
            where: {
                workspaceId: workspace.id,
                chain,
                recipientAddress,
                asset,
                purpose,
            },
            orderBy: {
                updatedAt: "desc",
            },
        });

        if (!latestReview) {
            return NextResponse.json({
                status: "review_required",
                reason: "No matching approval record exists",
            });
        }

        if (latestReview.decision === "rejected") {
            return NextResponse.json({
                status: "blocked",
                reviewId: latestReview.id,
                policyVersion: latestReview.policyVersion,
                reason: "Recipient has an explicit rejection for this context",
            });
        }

        if (latestReview.decision !== "approved") {
            return NextResponse.json({
                status: "review_required",
                reviewId: latestReview.id,
                policyVersion: latestReview.policyVersion,
                reason: "Latest review is not approved",
            });
        }

        if (latestReview.expiresAt && latestReview.expiresAt < new Date()) {
            return NextResponse.json({
                status: "review_required",
                reviewId: latestReview.id,
                policyVersion: latestReview.policyVersion,
                expiresAt: latestReview.expiresAt,
                reason: "Approval has expired",
            });
        }

        return NextResponse.json({
            status: "approved",
            reviewId: latestReview.id,
            policyVersion: latestReview.policyVersion,
            expiresAt: latestReview.expiresAt,
            reason: "Current approval matches this recipient and payment context",
        });
    } catch {
        return NextResponse.json(
            {
                status: "review_required",
                reason: "Precheck failed closed",
            },
            { status: 500 }
        );
    }
}