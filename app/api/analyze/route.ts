import { NextResponse } from "next/server";
import { SAMPLE_WALLETS } from "@/lib/constants";
import { mockAnalysisResults } from "@/lib/mock-analysis";
import {
    addConcentrationPercentages,
    buildRecentActivitySnapshot,
    formatRecentActivitySummary,
    getLiveHoldings,
    getRecentSignatures,
    isProbablyRealSolanaWallet,
} from "@/lib/solana";
import type { AnalysisResult, RiskFlag } from "@/types/analysis";

function buildLiveAnalysis(
    walletAddress: string,
    holdings: Array<{
        symbol: string;
        amount: number;
        usdValue: number;
        concentrationPct: number;
    }>,
    recentActivitySummary: string
): AnalysisResult {
    const topHolding = holdings[0];
    const holdingsCount = holdings.length;
    const topConcentration = topHolding?.concentrationPct ?? 0;

    const flags: RiskFlag[] = [];

    let score = 72;
    let scoreLabel = "Preliminary live read";
    let overview =
        "This is an early live wallet preview with an early value-proxy model. More detailed live risk analysis is still being built.";

    if (topConcentration >= 90) {
        score = 52;
        scoreLabel = "High concentration detected";
        overview =
            "This early live preview suggests a highly concentrated holdings profile. Additional transaction and counterparty analysis is recommended.";

        flags.push({
            code: "HIGH_TREASURY_CONCENTRATION",
            title: "High treasury concentration",
            severity: "high",
            explanation:
                "The wallet appears highly concentrated in a single visible holding, which may increase treasury or settlement fragility.",
        });
    } else if (topConcentration >= 70) {
        score = 63;
        scoreLabel = "Moderate concentration detected";
        overview =
            "This early live preview suggests a moderately concentrated holdings profile. Further review is recommended before relying on the wallet operationally.";

        flags.push({
            code: "HIGH_TREASURY_CONCENTRATION",
            title: "High treasury concentration",
            severity: "medium",
            explanation:
                "A large share of visible value appears concentrated in a single holding, which may reduce flexibility and increase risk.",
        });
    }

    return {
        summary: {
            walletAddress,
            label: "Live wallet preview",
            score,
            scoreLabel,
            overview,
        },
        flags,
        holdings,
        recentActivitySummary,
        recommendedNextChecks: [
            "Inspect recent transaction signatures and flow patterns.",
            "Review whether the holdings profile matches the wallet’s claimed treasury or settlement role.",
            `Assess whether concentration across ${holdingsCount} visible holding(s) is operationally acceptable.`,
        ],
    };
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const walletAddress = body.walletAddress?.trim();

        if (!walletAddress) {
            return NextResponse.json(
                { error: "Wallet address is required." },
                { status: 400 }
            );
        }

        if (walletAddress === SAMPLE_WALLETS[0].address) {
            return NextResponse.json(mockAnalysisResults.low);
        }

        if (walletAddress === SAMPLE_WALLETS[1].address) {
            return NextResponse.json(mockAnalysisResults.moderate);
        }

        if (walletAddress === SAMPLE_WALLETS[2].address) {
            return NextResponse.json(mockAnalysisResults.elevated);
        }

        if (!isProbablyRealSolanaWallet(walletAddress)) {
            return NextResponse.json(
                {
                    error:
                        "No mock analysis is available for this wallet yet. Use a sample wallet or enter a valid Solana wallet address.",
                },
                { status: 404 }
            );
        }

        const [rawHoldings, signatures] = await Promise.all([
            getLiveHoldings(walletAddress),
            getRecentSignatures(walletAddress, 10),
        ]);

        const holdings = addConcentrationPercentages(rawHoldings).sort(
            (a, b) => b.concentrationPct - a.concentrationPct
        );

        const activitySnapshot = buildRecentActivitySnapshot(signatures);
        const recentActivitySummary = formatRecentActivitySummary(activitySnapshot);

        const liveAnalysis = buildLiveAnalysis(
            walletAddress,
            holdings,
            recentActivitySummary
        );

        return NextResponse.json(liveAnalysis);
    } catch {
        return NextResponse.json(
            { error: "Failed to process analysis request." },
            { status: 500 }
        );
    }
}