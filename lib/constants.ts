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
        label: "Low-risk example",
        address: "DemoLowRiskWallet111111111111111111111111111",
    },
    {
        label: "Moderate-risk example",
        address: "DemoModerateRiskWallet11111111111111111111",
    },
    {
        label: "Elevated-risk example",
        address: "DemoElevatedRiskWallet11111111111111111111",
    },
];