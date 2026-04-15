import type { AnalysisResult } from "@/types/analysis";
import { RISK_FLAG_CODES } from "@/lib/risk-flags";

export const mockAnalysisResults: Record<string, AnalysisResult> = {
    low: {
        summary: {
            walletAddress: "DemoLowRiskWallet111111111111111111111111111",
            label: "Low-risk example",
            score: 86,
            scoreLabel: "Low apparent risk",
            overview:
                "Wallet activity appears relatively consistent, with diversified holdings and no immediate concentration or behavioral anomalies.",
        },
        flags: [],
        holdings: [
            { symbol: "USDC", amount: 12000, usdValue: 12000, concentrationPct: 50.0 },
            { symbol: "SOL", amount: 80, usdValue: 11200, concentrationPct: 46.7 },
            { symbol: "JTO", amount: 400, usdValue: 900, concentrationPct: 3.3 },
        ],
        recentActivitySummary:
            "Activity has been steady across recent periods, with a healthy spread of counterparties and no major dormancy spike.",
        recommendedNextChecks: [
            "Validate the entity context associated with the wallet.",
            "Review major counterparties for strategic relevance.",
            "Confirm treasury mandate and expected operational behavior.",
        ],
    },

    moderate: {
        summary: {
            walletAddress: "DemoModerateRiskWallet11111111111111111111",
            label: "Moderate-risk example",
            score: 64,
            scoreLabel: "Moderate risk",
            overview:
                "Wallet shows moderate concentration and somewhat narrow counterparty behaviour. Further diligence is recommended before approval.",
        },
        flags: [
            {
                code: RISK_FLAG_CODES.LOW_COUNTERPARTY_DIVERSITY,
                title: "Low counterparty diversity",
                severity: "medium",
                explanation:
                    "Transfers repeatedly interact with a narrow set of counterparties.",
            },
        ],
        holdings: [
            { symbol: "USDC", amount: 25000, usdValue: 25000, concentrationPct: 85.6 },
            { symbol: "SOL", amount: 30, usdValue: 4200, concentrationPct: 14.4 },
        ],
        recentActivitySummary:
            "Recent activity is somewhat concentrated, with fewer unique counterparties than expected for a broadly distributed treasury profile.",
        recommendedNextChecks: [
            "Review counterparties in more detail.",
            "Confirm whether wallet behaviour matches the claimed operational role.",
            "Assess whether concentration is temporary or structural.",
        ],
    },

    elevated: {
        summary: {
            walletAddress: "DemoElevatedRiskWallet11111111111111111111",
            label: "Elevated-risk example",
            score: 41,
            scoreLabel: "Elevated risk",
            overview:
                "Wallet shows elevated concentration and volatile recent flow behaviour. Review should proceed with caution.",
        },
        flags: [
            {
                code: RISK_FLAG_CODES.HIGH_TREASURY_CONCENTRATION,
                title: "High treasury concentration",
                severity: "high",
                explanation:
                    "The wallet is heavily concentrated in one asset, increasing treasury fragility.",
            },
            {
                code: RISK_FLAG_CODES.ERRATIC_SETTLEMENT_FLOW,
                title: "Erratic settlement flow",
                severity: "high",
                explanation:
                    "Recent inflow and outflow behaviour appears abrupt and concentrated in a short time window.",
            },
        ],
        holdings: [
            { symbol: "XYZ", amount: 900000, usdValue: 50000, concentrationPct: 99.2 },
            { symbol: "SOL", amount: 3, usdValue: 420, concentrationPct: 0.8 },
        ],
        recentActivitySummary:
            "Wallet activity appears sparse historically but highly concentrated in recent periods, with sharp balance shifts and limited counterparty diversity.",
        recommendedNextChecks: [
            "Escalate to manual review.",
            "Validate source and destination of recent large transfers.",
            "Confirm whether the wallet has a legitimate treasury or settlement role.",
            "Reassess after additional transactional history is gathered.",
        ],
    },
};
