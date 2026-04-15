import type { AnalysisResult } from "@/types/analysis";

export const mockAnalysisResults: Record<string, AnalysisResult> = {
    low: {
        walletAddress: "DemoLowRiskWallet111111111111111111111111111",
        label: "Low-risk example",
        score: 86,
        summary:
            "Wallet activity appears relatively consistent, with diversified holdings and no immediate concentration or behavioral anomalies.",
        holdings: [
            { symbol: "USDC", amount: 12000, usdValue: 12000 },
            { symbol: "SOL", amount: 80, usdValue: 11200 },
            { symbol: "JTO", amount: 400, usdValue: 900 },
        ],
        activity: {
            totalTransactions: 148,
            activeDays: 41,
            uniqueCounterparties: 22,
            latestActivityAt: "2026-04-15T10:00:00Z",
        },
        flags: [],
    },
    moderate: {
        walletAddress: "DemoModerateRiskWallet11111111111111111111",
        label: "Moderate-risk example",
        score: 64,
        summary:
            "Wallet shows moderate concentration and a somewhat narrow counterparty pattern. Further diligence is recommended before approval.",
        holdings: [
            { symbol: "USDC", amount: 25000, usdValue: 25000 },
            { symbol: "SOL", amount: 30, usdValue: 4200 },
        ],
        activity: {
            totalTransactions: 62,
            activeDays: 18,
            uniqueCounterparties: 5,
            latestActivityAt: "2026-04-14T14:30:00Z",
        },
        flags: [
            {
                code: "LOW_COUNTERPARTY_DIVERSITY",
                title: "Low counterparty diversity",
                severity: "medium",
                explanation:
                    "Transfers repeatedly interact with a narrow set of counterparties.",
            },
        ],
    },
    elevated: {
        walletAddress: "DemoElevatedRiskWallet11111111111111111111",
        label: "Elevated-risk example",
        score: 41,
        summary:
            "Wallet shows elevated concentration and volatile recent flow behavior. Review should proceed with caution.",
        holdings: [
            { symbol: "XYZ", amount: 900000, usdValue: 50000 },
            { symbol: "SOL", amount: 3, usdValue: 420 },
        ],
        activity: {
            totalTransactions: 12,
            activeDays: 3,
            uniqueCounterparties: 2,
            latestActivityAt: "2026-04-15T08:45:00Z",
        },
        flags: [
            {
                code: "HIGH_ASSET_CONCENTRATION",
                title: "High asset concentration",
                severity: "high",
                explanation:
                    "The wallet is heavily concentrated in one asset, increasing treasury fragility.",
            },
            {
                code: "VOLATILE_FLOW_PATTERN",
                title: "Volatile flow pattern",
                severity: "high",
                explanation:
                    "Recent inflow and outflow behavior appears abrupt and concentrated in a short time window.",
            },
        ],
    },
};