import type { ReviewStatus } from "@/types/analysis";

export interface AttestationPayload {
    subjectWallet: string;
    memoHash: string;
    reviewStatus: ReviewStatus;
    generatedAt: string;
    reviewLabel?: string;
}