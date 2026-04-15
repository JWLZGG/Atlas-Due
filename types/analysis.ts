export type ReviewStatus =
    | "pending"
    | "reviewed"
    | "elevated_risk"
    | "approved_with_caveats";

export type RiskSeverity = "low" | "medium" | "high";

export type RiskFlagCode =
    | "HIGH_ASSET_CONCENTRATION"
    | "SUDDEN_ACTIVITY_AFTER_DORMANCY"
    | "LOW_COUNTERPARTY_DIVERSITY"
    | "TREASURY_FRAGILITY"
    | "VOLATILE_FLOW_PATTERN"
    | "PROFILE_BEHAVIOR_MISMATCH";

export interface RiskFlag {
    code: RiskFlagCode;
    title: string;
    severity: RiskSeverity;
    explanation: string;
}

export interface HoldingSnapshot {
    symbol: string;
    amount: number;
    usdValue?: number;
}

export interface ActivitySnapshot {
    totalTransactions: number;
    activeDays: number;
    uniqueCounterparties: number;
    latestActivityAt?: string;
}

export interface AnalysisResult {
    walletAddress: string;
    label?: string;
    score: number;
    summary: string;
    holdings: HoldingSnapshot[];
    activity: ActivitySnapshot;
    flags: RiskFlag[];
}