import type { AnalysisResult } from "@/types/analysis";

type AnalysisPanelProps = {
    analysis: AnalysisResult;
};

export function AnalysisPanel({ analysis }: AnalysisPanelProps) {
    return (
        <section className="mt-8 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-wide text-slate-500">
                            Analysis summary
                        </p>
                        <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                            {analysis.label ?? "Wallet analysis"}
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            {analysis.walletAddress}
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-900 px-4 py-3 text-white">
                        <p className="text-xs uppercase tracking-wide text-slate-300">
                            Score
                        </p>
                        <p className="text-2xl font-semibold">{analysis.score}</p>
                    </div>
                </div>

                <p className="text-base leading-7 text-slate-700">{analysis.summary}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">
                        Risk flags
                    </h3>

                    {analysis.flags.length === 0 ? (
                        <p className="text-sm text-slate-600">
                            No major risk flags detected in this mock scenario.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {analysis.flags.map((flag) => (
                                <div
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
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">
                        Activity snapshot
                    </h3>

                    <dl className="space-y-3 text-sm text-slate-700">
                        <div className="flex justify-between gap-4">
                            <dt>Total transactions</dt>
                            <dd className="font-medium">{analysis.activity.totalTransactions}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt>Active days</dt>
                            <dd className="font-medium">{analysis.activity.activeDays}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt>Unique counterparties</dt>
                            <dd className="font-medium">
                                {analysis.activity.uniqueCounterparties}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt>Latest activity</dt>
                            <dd className="font-medium">
                                {analysis.activity.latestActivityAt ?? "N/A"}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">Holdings</h3>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="border-b border-slate-200 text-slate-500">
                            <tr>
                                <th className="pb-3 pr-6 font-medium">Asset</th>
                                <th className="pb-3 pr-6 font-medium">Amount</th>
                                <th className="pb-3 font-medium">Estimated USD</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analysis.holdings.map((holding) => (
                                <tr key={holding.symbol} className="border-b border-slate-100">
                                    <td className="py-3 pr-6 font-medium text-slate-900">
                                        {holding.symbol}
                                    </td>
                                    <td className="py-3 pr-6 text-slate-700">{holding.amount}</td>
                                    <td className="py-3 text-slate-700">
                                        {holding.usdValue ? `$${holding.usdValue.toLocaleString()}` : "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}