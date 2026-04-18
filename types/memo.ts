import type { RiskFlag } from "@/types/analysis";

export interface ReviewMemo {
    title: string;
    subjectWallet: string;
    label?: string;
    score: number;
    scoreLabel: string;
    summary: string;
    flags: RiskFlag[];
    recentActivitySummary: string;
    recommendedNextChecks: string[];
    memoHash: string;
}