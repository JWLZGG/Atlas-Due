import type { AttestationPayload } from "@/types/attestation";
import type { ReviewMemo } from "@/types/memo";
import type { ReviewStatus } from "@/types/analysis";

export function buildAttestationPayload(
    memo: ReviewMemo,
    reviewStatus: ReviewStatus
): AttestationPayload {
    return {
        subjectWallet: memo.subjectWallet,
        memoHash: memo.memoHash,
        reviewStatus,
        generatedAt: new Date().toISOString(),
        reviewLabel: memo.label,
    };
}