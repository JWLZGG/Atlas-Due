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

export type ReviewDecision = "approved" | "rejected" | "escalated";

export type PrecheckStatus = "approved" | "review_required" | "blocked";

export type CreateReviewInput = {
    workspaceId: string;
    chain: "solana";
    recipientAddress: string;
    counterpartyLabel: string;
    asset: string;
    amount: string;
    purpose: string;
};