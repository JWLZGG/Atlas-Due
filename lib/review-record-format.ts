import type { OnchainReviewRecord } from "@/types/review-record";
import type { ReviewStatus } from "@/types/analysis";

export function reviewStatusFromU8(status: number): ReviewStatus | "unknown" {
    switch (status) {
        case 0:
            return "pending";
        case 1:
            return "reviewed";
        case 2:
            return "elevated_risk";
        case 3:
            return "approved_with_caveats";
        default:
            return "unknown";
    }
}

export function bytesToHex(bytes: number[] | Uint8Array): string {
    return Array.from(bytes)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}

export function formatUnixTimestamp(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleString();
}

export function statusLabelFromRecord(record: OnchainReviewRecord): string {
    const status = reviewStatusFromU8(record.status);
    return status === "unknown" ? "unknown" : status.replaceAll("_", " ");
}