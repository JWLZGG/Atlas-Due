import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEMO_API_KEY = "atlas_due_demo_key";

export async function POST(request: Request) {
    try {
        const auth = request.headers.get("authorization");
        const token = auth?.replace("Bearer ", "");

        if (token !== DEMO_API_KEY) {
            return NextResponse.json(
                {
                    status: "review_required",
                    reason: "Missing or invalid workspace API key.",
                },
                { status: 401 }
            );
        }

        const workspace = await prisma.workspace.findUnique({
            where: {
                apiKey: DEMO_API_KEY,
            },
        });

        if (!workspace) {
            return NextResponse.json(
                {
                    status: "review_required",
                    reason: "Workspace not found.",
                },
                { status: 500 }
            );
        }

        const body = await request.json();

        const { chain, recipientAddress, asset, purpose } = body;

        if (!chain || !recipientAddress || !asset || !purpose) {
            return NextResponse.json(
                {
                    status: "review_required",
                    reason:
                        "Missing required fields. chain, recipientAddress, asset and purpose are required.",
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
                reason: "No matching saved review exists for this payment context.",
            });
        }

        if (latestReview.decision === "rejected") {
            return NextResponse.json({
                status: "blocked",
                reviewId: latestReview.id,
                policyVersion: latestReview.policyVersion,
                reason: "Latest matching review explicitly rejected this context.",
            });
        }

        if (latestReview.decision !== "approved") {
            return NextResponse.json({
                status: "review_required",
                reviewId: latestReview.id,
                policyVersion: latestReview.policyVersion,
                reason: "Latest matching review is not approved.",
            });
        }

        if (latestReview.expiresAt && latestReview.expiresAt < new Date()) {
            return NextResponse.json({
                status: "review_required",
                reviewId: latestReview.id,
                policyVersion: latestReview.policyVersion,
                expiresAt: latestReview.expiresAt.toISOString(),
                reason: "Matching approval has expired.",
            });
        }

        return NextResponse.json({
            status: "approved",
            reviewId: latestReview.id,
            policyVersion: latestReview.policyVersion,
            expiresAt: latestReview.expiresAt?.toISOString() ?? null,
            reason: "Current saved approval matches this recipient and payment context.",
        });
    } catch (error) {
        console.error("Precheck failed:", error);

        return NextResponse.json(
            {
                status: "review_required",
                reason: "Precheck failed closed.",
            },
            { status: 500 }
        );
    }
}