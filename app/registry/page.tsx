"use client";

import { useEffect, useState } from "react";

type RegistryReview = {
    id: string;
    recipientAddress: string;
    counterpartyLabel: string;
    asset: string;
    amount: string;
    purpose: string;
    decision: string;
    rationale: string;
    reviewerId: string;
    decidedAt: string;
    expiresAt: string | null;
    policyVersion: string;
    updatedAt: string;
};

export default function RegistryPage() {
    const [reviews, setReviews] = useState<RegistryReview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchRegistry() {
            try {
                const response = await fetch("/api/registry");
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error ?? "Failed to fetch registry.");
                }

                setReviews(data.reviews);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Failed to fetch registry."
                );
            } finally {
                setIsLoading(false);
            }
        }

        fetchRegistry();
    }, []);

    return (
        <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
            <div className="mx-auto max-w-6xl">
                <a href="/" className="text-sm text-slate-600 underline">
                    Back to review workflow
                </a>

                <p className="mt-8 text-sm uppercase tracking-wide text-slate-500">
                    Recipient registry
                </p>

                <h1 className="mt-2 text-3xl font-semibold">
                    Saved recipient review records
                </h1>

                <p className="mt-3 max-w-3xl text-slate-600">
                    This registry shows context-specific recipient decisions that can be
                    checked before funds move.
                </p>

                <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    {isLoading ? (
                        <p className="p-6 text-sm text-slate-600">Loading registry...</p>
                    ) : error ? (
                        <p className="p-6 text-sm text-red-600">{error}</p>
                    ) : reviews.length === 0 ? (
                        <p className="p-6 text-sm text-slate-600">
                            No saved reviews yet. Create and save a recipient review first.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">Counterparty</th>
                                        <th className="px-4 py-3">Recipient</th>
                                        <th className="px-4 py-3">Context</th>
                                        <th className="px-4 py-3">Decision</th>
                                        <th className="px-4 py-3">Reviewer</th>
                                        <th className="px-4 py-3">Expiry</th>
                                        <th className="px-4 py-3">Policy</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {reviews.map((review) => (
                                        <tr key={review.id} className="border-b border-slate-100">
                                            <td className="px-4 py-4">
                                                {review.counterpartyLabel}
                                            </td>

                                            <td className="max-w-xs truncate px-4 py-4 font-mono text-xs">
                                                {review.recipientAddress}
                                            </td>

                                            <td className="px-4 py-4">
                                                <div>
                                                    {review.amount} {review.asset}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {review.purpose}
                                                </div>
                                            </td>

                                            <td className="px-4 py-4">
                                                <span className="rounded-full border border-slate-300 px-3 py-1 text-xs capitalize">
                                                    {review.decision}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">{review.reviewerId}</td>

                                            <td className="px-4 py-4">
                                                {review.expiresAt
                                                    ? new Date(review.expiresAt).toLocaleDateString()
                                                    : "No expiry"}
                                            </td>

                                            <td className="px-4 py-4">{review.policyVersion}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}