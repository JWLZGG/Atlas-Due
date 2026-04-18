import type { ReviewStatus } from "@/types/analysis";

export const APP_NAME = "Atlas Due";

export const REVIEW_STATUSES: ReviewStatus[] = [
    "pending",
    "reviewed",
    "elevated_risk",
    "approved_with_caveats",
];

export const SAMPLE_WALLETS = [
    {
        label: "Low-risk settlement wallet",
        address: "DemoLowRiskWallet111111111111111111111111111",
    },
    {
        label: "Moderate-risk treasury wallet",
        address: "DemoModerateRiskWallet11111111111111111111",
    },
    {
        label: "Elevated-risk counterparty wallet",
        address: "DemoElevatedRiskWallet11111111111111111111",
    },
];