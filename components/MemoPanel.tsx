import type { AnalysisResult } from "@/types/analysis";

type MemoPanelProps = {
    analysis: AnalysisResult;
};

export function MemoPanel({ analysis }: MemoPanelProps) {
    return (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm uppercase tracking-wide text-slate-500">
                        Diligence memo
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                        {analysis.summary.label ?? "Wallet review memo"}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        {analysis.summary.walletAddress}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                        Diligence score
                    </p>
                    <p className="text-xl font-semibold text-slate-900">
                        {analysis.summary.score}
                    </p>
                    <p className="text-xs text-slate-600">
                        {analysis.summary.scoreLabel}
                    </p>
                </div>
            </div>

            <div className="space-y-6 text-sm leading-7 text-slate-700">
                <section>
                    <h3 className="mb-2 text-base font-semibold text-slate-900">
                        1. Executive overview
                    </h3>
                    <p>{analysis.summary.overview}</p>
                </section>

                <section>
                    <h3 className="mb-2 text-base font-semibold text-slate-900">
                        2. Key risk flags
                    </h3>
                    {analysis.flags.length === 0 ? (
                        <p>No major risk flags were triggered in this scenario.</p>
                    ) : (
                        <ul className="list-disc space-y-2 pl-5">
                            {analysis.flags.map((flag) => (
                                <li key={flag.code}>
                                    <span className="font-medium text-slate-900">{flag.title}:</span>{" "}
                                    {flag.explanation}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section>
                    <h3 className="mb-2 text-base font-semibold text-slate-900">
                        3. Recent activity summary
                    </h3>
                    <p>{analysis.recentActivitySummary}</p>
                </section>

                <section>
                    <h3 className="mb-2 text-base font-semibold text-slate-900">
                        4. Holdings snapshot
                    </h3>
                    <ul className="list-disc space-y-1 pl-5">
                        {analysis.holdings.map((holding) => (
                            <li key={holding.symbol}>
                                <span className="font-medium">{holding.symbol}</span> —{" "}
                                {holding.amount} (~${holding.usdValue.toLocaleString()},{" "}
                                {holding.concentrationPct.toFixed(1)}%)
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h3 className="mb-2 text-base font-semibold text-slate-900">
                        5. Recommended next checks
                    </h3>
                    <ul className="list-disc space-y-1 pl-5">
                        {analysis.recommendedNextChecks.map((check, index) => (
                            <li key={index}>{check}</li>
                        ))}
                    </ul>
                </section>
            </div>
        </section>
    );
}