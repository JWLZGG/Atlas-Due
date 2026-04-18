import type { ReviewStatus } from "@/types/analysis";

type ReviewStatusSelectorProps = {
    value: ReviewStatus;
    onChange: (value: ReviewStatus) => void;
};

const REVIEW_STATUS_OPTIONS: Array<{
    value: ReviewStatus;
    label: string;
}> = [
        { value: "pending", label: "Pending" },
        { value: "reviewed", label: "Reviewed" },
        { value: "elevated_risk", label: "Elevated risk" },
        { value: "approved_with_caveats", label: "Approved with caveats" },
    ];

export function ReviewStatusSelector({
    value,
    onChange,
}: ReviewStatusSelectorProps) {
    return (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
                <p className="text-sm uppercase tracking-wide text-slate-500">
                    Review status
                </p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">
                    Select review outcome
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                    This status will be included in the future onchain attestation payload.
                </p>
            </div>

            <div className="flex flex-wrap gap-3">
                {REVIEW_STATUS_OPTIONS.map((option) => {
                    const isActive = option.value === value;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange(option.value)}
                            className={
                                isActive
                                    ? "rounded-xl border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                                    : "rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            }
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}