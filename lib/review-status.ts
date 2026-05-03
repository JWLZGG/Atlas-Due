import type { ReviewStatus } from "@/types/analysis";

export function reviewStatusToU8(status: ReviewStatus): number {
    switch (status) {
        case "pending":
            return 0;
        case "reviewed":
            return 1;
        case "elevated_risk":
            return 2;
        case "approved_with_caveats":
            return 3;
        default:
            throw new Error(`Unsupported review status: ${status}`);
    }
}