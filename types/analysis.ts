export type RiskSeverity = "low" | "medium" | "high";

export type ReviewStatus =
    | "pending"
    | "reviewed"
    | "elevated_risk"
    | "approved_with_caveats";

export interface RiskFlag {
    code: string;
    title: string;
    severity: RiskSeverity;
    explanation: string;
}

export interface Holding {
    symbol: string;
    amount: number;
    usdValue: number;
    concentrationPct: number;
}

export interface WalletSummary {
    walletAddress: string;
    label?: string;
    score: number;
    scoreLabel: string;
    overview: string;
}

export interface AnalysisResult {
    summary: WalletSummary;
    flags: RiskFlag[];
    holdings: Holding[];
    recentActivitySummary: string;
    recommendedNextChecks: string[];
}