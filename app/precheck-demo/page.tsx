"use client";

import { useState } from "react";

type PrecheckResult = {
    status: "approved" | "review_required" | "blocked";
    reviewId?: string;
    policyVersion?: string;
    expiresAt?: string | null;
    reason: string;
};

export default function PrecheckDemoPage() {
    const [recipientAddress, setRecipientAddress] = useState("");
    const [asset, setAsset] = useState("USDC");
    const [amount, setAmount] = useState("2500");
    const [purpose, setPurpose] = useState("vendor-payout");
    const [result, setResult] = useState<PrecheckResult | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [error, setError] = useState("");

    async function handlePrecheck(event: React.FormEvent) {
        event.preventDefault();

        setIsChecking(true);
        setError("");
        setResult(null);

        try {
            const response = await fetch("/api/precheck", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer atlas_due_demo_key",
                },
                body: JSON.stringify({
                    chain: "solana",
                    recipientAddress,
                    asset,
                    amount,
                    purpose,
                }),
            });

            const data = await response.json();

            if (!response.ok && !data.status) {
                throw new Error(data.error ?? "Precheck failed.");
            }

            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Precheck failed.");
        } finally {
            setIsChecking(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
            <div className="mx-auto max-w-4xl">
                <a href="/" className="text-sm text-slate-600 underline">
                    Back to review workflow
                </a>

                <p className="mt-8 text-sm uppercase tracking-wide text-slate-500">
                    Precheck API demo
                </p>

                <h1 className="mt-2 text-3xl font-semibold">
                    Simulate a treasury or payment integration
                </h1>

                <p className="mt-3 text-slate-600">
                    This page simulates how a treasury tool, or a payment
                    platform could check Atlas Due before funds move.
                </p>

                <form
                    onSubmit={handlePrecheck}
                    className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                    <label className="block">
                        <span className="text-sm font-medium">Recipient wallet</span>
                        <input
                            value={recipientAddress}
                            onChange={(event) => setRecipientAddress(event.target.value)}
                            placeholder="Paste the same recipient wallet used in a saved review"
                            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm"
                            required
                        />
                    </label>

                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                        <label className="block">
                            <span className="text-sm font-medium">Asset</span>
                            <input
                                value={asset}
                                onChange={(event) => setAsset(event.target.value)}
                                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium">Amount</span>
                            <input
                                value={amount}
                                onChange={(event) => setAmount(event.target.value)}
                                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium">Purpose</span>
                            <input
                                value={purpose}
                                onChange={(event) => setPurpose(event.target.value)}
                                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                            />
                        </label>
                    </div>

                    {error ? (
                        <p className="mt-4 text-sm text-red-600">{error}</p>
                    ) : null}

                    <button
                        type="submit"
                        disabled={isChecking}
                        className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
                    >
                        {isChecking ? "Running precheck..." : "Run precheck"}
                    </button>
                </form>

                {result ? (
                    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm uppercase tracking-wide text-slate-500">
                            API response
                        </p>

                        <h2 className="mt-2 text-2xl font-semibold capitalize">
                            {result.status.replaceAll("_", " ")}
                        </h2>

                        <p className="mt-3 text-slate-700">{result.reason}</p>

                        <pre className="mt-5 overflow-x-auto rounded-xl bg-slate-950 p-5 text-sm text-slate-50">
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </section>
                ) : null}
            </div>
        </main>
    );
}