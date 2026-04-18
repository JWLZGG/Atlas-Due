import type { AttestationPayload } from "@/types/attestation";
import type { ReviewMemo } from "@/types/memo";

type MemoPanelProps = {
    memo: ReviewMemo;
    attestationPayload?: AttestationPayload | null;
};

export function MemoPanel({ memo, attestationPayload }: MemoPanelProps) {
    return (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:shadow-none">
            <div className="mb-6 border-b border-slate-200 pb-4">
                <p className="text-sm uppercase tracking-wide text-slate-500">
                    Review memo
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                    {memo.label ?? memo.title}
                </h2>
                <p className="mt-2 break-all text-sm text-slate-500">
                    {memo.subjectWallet}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                    This memo summarizes wallet-level risk signals, recent activity
                    context, and recommended next checks for treasury, settlement, or
                    payment-counterparty review.
                </p>
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-2">
                <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                        Score
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">
                        {memo.score}
                    </p>
                    <p className="text-sm text-slate-600">{memo.scoreLabel}</p>
                </div>

                <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                        Summary
                    </p>
                    <p className="mt-1 text-sm leading-7 text-slate-700">
                        {memo.summary}
                    </p>
                </div>
            </div>

            <div className="mb-6">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                    Memo hash
                </p>
                <p className="mt-2 break-all rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700">
                    {memo.memoHash}
                </p>
            </div>

            {attestationPayload ? (
                <div className="mb-6">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                        Attestation payload preview
                    </p>
                    <pre className="mt-2 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                        {JSON.stringify(attestationPayload, null, 2)}
                    </pre>
                </div>
            ) : null}

            <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                    Key flags
                </h3>

                {memo.flags.length === 0 ? (
                    <p className="text-sm text-slate-600">
                        No major flags were identified in this review scenario.
                    </p>
                ) : (
                    <ul className="space-y-3">
                        {memo.flags.map((flag) => (
                            <li
                                key={flag.code}
                                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                            >
                                <div className="mb-1 flex items-center justify-between gap-3">
                                    <p className="font-medium text-slate-900">{flag.title}</p>
                                    <span className="rounded-full border border-slate-300 px-2 py-1 text-xs uppercase tracking-wide text-slate-600">
                                        {flag.severity}
                                    </span>
                                </div>
                                <p className="text-sm leading-6 text-slate-600">
                                    {flag.explanation}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                    Recent activity summary
                </h3>
                <p className="text-sm leading-7 text-slate-700">
                    {memo.recentActivitySummary}
                </p>
            </div>

            <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                    Recommended next checks
                </h3>
                <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700">
                    {memo.recommendedNextChecks.map((check, index) => (
                        <li key={index}>{check}</li>
                    ))}
                </ul>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 print:hidden">
                <button
                    type="button"
                    onClick={() => window.print()}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                    Print memo
                </button>

                <button
                    type="button"
                    disabled
                    className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-medium text-slate-500"
                >
                    Attest review (coming soon)
                </button>
            </div>
        </section>
    );
}