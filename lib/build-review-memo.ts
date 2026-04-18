import { createHash } from "crypto";
import type { AnalysisResult } from "@/types/analysis";
import type { ReviewMemo } from "@/types/memo";

function sha256Hex(input: string): string {
    return createHash("sha256").update(input).digest("hex");
}

function buildMemoHashInput(analysis: AnalysisResult): string {
    return JSON.stringify({
        walletAddress: analysis.summary.walletAddress,
        label: analysis.summary.label,
        score: analysis.summary.score,
        scoreLabel: analysis.summary.scoreLabel,
        overview: analysis.summary.overview,
        flags: analysis.flags,
        holdings: analysis.holdings,
        recentActivitySummary: analysis.recentActivitySummary,
        recommendedNextChecks: analysis.recommendedNextChecks,
    });
}

export async function buildReviewMemo(
    analysis: AnalysisResult
): Promise<ReviewMemo> {
    const hashInput = buildMemoHashInput(analysis);
    const memoHash = sha256Hex(hashInput);

    return {
        title: "Settlement wallet review memo",
        subjectWallet: analysis.summary.walletAddress,
        label: analysis.summary.label,
        score: analysis.summary.score,
        scoreLabel: analysis.summary.scoreLabel,
        summary: analysis.summary.overview,
        flags: analysis.flags,
        recentActivitySummary: analysis.recentActivitySummary,
        recommendedNextChecks: analysis.recommendedNextChecks,
        memoHash,
    };
}