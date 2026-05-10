export type OnchainReviewRecord = {
    subjectWallet: string;
    reviewer: string;
    memoHashHex: string;
    status: number;
    createdAt: number;
    updatedAt: number;
    bump: number;
};