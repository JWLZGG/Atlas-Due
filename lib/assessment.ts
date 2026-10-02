import { isProbablyRealSolanaWallet } from "@/lib/solana";
import type { ReviewEvidence } from "@/types/review";

type BuildAssessmentInput = {
    recipientAddress: string;
    asset: string;
    amount: string;
    purpose: string;
    counterpartyLabel: string;
};

export async function buildTransferAssessment(
    input: BuildAssessmentInput
): Promise<{
    evidence: ReviewEvidence;
    assessment: {
        flags: Array<{
            code: string;
            title: string;
            severity: "low" | "medium" | "high";
            explanation: string;
        }>;
        recommendedDecision: "approved" | "review_required" | "blocked";
    };
}> {
    const checkedAt = new Date().toISOString();

    const observations: ReviewEvidence["observations"] = [
        {
            label: "Recipient address format",
            value: isProbablyRealSolanaWallet(input.recipientAddress)
                ? "Valid Solana public key"
                : "Invalid Solana public key",
            status: "observed",
        },
        {
            label: "Asset",
            value: input.asset || "Unknown",
            status: input.asset ? "observed" : "unknown",
        },
        {
            label: "Amount",
            value: input.amount || "Unknown",
            status: input.amount ? "observed" : "unknown",
        },
        {
            label: "Payment purpose",
            value: input.purpose || "Unknown",
            status: input.purpose ? "observed" : "unknown",
        },
    ];

    const flags = [];

    if (!isProbablyRealSolanaWallet(input.recipientAddress)) {
        flags.push({
            code: "INVALID_RECIPIENT_ADDRESS",
            title: "Invalid recipient address",
            severity: "high" as const,
            explanation: "The recipient address is not a valid Solana public key.",
        });
    }

    if (!input.purpose) {
        flags.push({
            code: "MISSING_PAYMENT_PURPOSE",
            title: "Missing payment purpose",
            severity: "medium" as const,
            explanation: "The payment purpose is required for review context.",
        });
    }

    const recommendedDecision =
        flags.some((flag) => flag.severity === "high")
            ? "blocked"
            : flags.length > 0
                ? "review_required"
                : "approved";

    return {
        evidence: {
            checkedAt,
            source: "Atlas Due pilot assessment engine",
            observations,
        },
        assessment: {
            flags,
            recommendedDecision,
        },
    };
}