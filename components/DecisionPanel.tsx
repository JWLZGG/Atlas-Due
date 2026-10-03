import type { ReviewDecision } from "@/types/review";

type DecisionPanelProps = {
    decision: ReviewDecision | null;
    rationale: string;
    expiresAt: string;
    onDecisionChange: (decision: ReviewDecision) => void;
    onRationaleChange: (value: string) => void;
    onExpiresAtChange: (value: string) => void;
    onSave: () => void;
    isSaving: boolean;
    saveError: string | null;
};

const decisions: Array<{
    value: ReviewDecision;
    label: string;
}> = [
        { value: "approved", label: "Approve" },
        { value: "rejected", label: "Reject" },
        { value: "escalated", label: "Escalate" },
    ];

export function DecisionPanel({
    decision,
    rationale,
    expiresAt,
    onDecisionChange,
    onRationaleChange,
    onExpiresAtChange,
    onSave,
    isSaving,
    saveError,
}: DecisionPanelProps) {
    return (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
                <p className="text-sm uppercase tracking-wide text-slate-500">
                    Human decision
                </p>

                <h2 className="mt-1 text-xl font-semibold text-slate-900">
                    Record the review outcome
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                    The evidence informs the decision. The reviewer remains responsible
                    for approving, rejecting, or escalating the payment context.
                </p>
            </div>

            <div className="flex flex-wrap gap-3">
                {decisions.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onDecisionChange(option.value)}
                        className={
                            decision === option.value
                                ? "rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                                : "rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        }
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            <label className="mt-5 block text-sm font-medium text-slate-700">
                Rationale
                <textarea
                    value={rationale}
                    onChange={(event) =>
                        onRationaleChange(event.target.value)
                    }
                    placeholder="Explain why this payment context is approved, rejected, or escalated."
                    rows={4}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                />
            </label>

            <label className="mt-5 block text-sm font-medium text-slate-700">
                Approval expiry
                <input
                    type="date"
                    value={expiresAt}
                    onChange={(event) =>
                        onExpiresAtChange(event.target.value)
                    }
                    className="mt-2 block rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                />
            </label>

            <p className="mt-2 text-xs text-slate-500">
                Expiry is primarily relevant to approvals. An expired approval will
                later return review_required from the precheck API.
            </p>

            {saveError ? (
                <p className="mt-4 text-sm text-red-600">
                    {saveError}
                </p>
            ) : null}

            <button
                type="button"
                onClick={onSave}
                disabled={isSaving}
                className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isSaving ? "Saving review..." : "Save review"}
            </button>
        </section>
    );
}