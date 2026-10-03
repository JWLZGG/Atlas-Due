import type { AnalysisResult } from "@/types/analysis";

export type EvidenceObservation = {
    label: string;
    value: string;
    status: "observed" | "unknown";
};

export type ReviewEvidence = {
    checkedAt: string;
    source: string;
    observations: EvidenceObservation[];
};

export type ReviewDecision =
    | "approved"
    | "rejected"
    | "escalated";

export type TransferContext = {
    counterpartyLabel: string;
    asset: string;
    amount: string;
    purpose: string;
};

export type ReviewDraft = {
    recipientAddress: string;
    transferContext: TransferContext;
    analysis: AnalysisResult;
    decision: ReviewDecision;
    rationale: string;
    expiresAt: string | null;
};

export type SavedReview = {
    id: string;
    recipientAddress: string;
    counterpartyLabel: string;
    asset: string;
    amount: string;
    purpose: string;
    decision: ReviewDecision;
    rationale: string;
    reviewerId: string;
    decidedAt: string;
    expiresAt: string | null;
    policyVersion: string;
};