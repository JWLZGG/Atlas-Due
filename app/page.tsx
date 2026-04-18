"use client";

import { useEffect, useState } from "react";
import { SearchCard } from "@/components/SearchCard";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import { MemoPanel } from "@/components/MemoPanel";
import { buildReviewMemo } from "@/lib/build-review-memo";
import { SAMPLE_WALLETS } from "@/lib/constants";
import type { AnalysisResult } from "@/types/analysis";
import type { ReviewMemo } from "@/types/memo";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [memoState, setMemoState] = useState<ReviewMemo | null>(null);

  const handleAnalyze = async () => {
    const trimmedWallet = walletAddress.trim();

    if (!trimmedWallet) {
      setAnalysis(null);
      setErrorMessage("Please enter a wallet address.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress: trimmedWallet }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAnalysis(null);
        setErrorMessage(
          data.error ?? "No mock analysis is available for this wallet yet."
        );
        return;
      }

      setAnalysis(data);
    } catch {
      setAnalysis(null);
      setErrorMessage("Something went wrong while analyzing this wallet.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSampleWallet = async (address: string) => {
    setWalletAddress(address);
    setAnalysis(null);
    setErrorMessage(null);

    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress: address }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAnalysis(null);
        setErrorMessage(
          data.error ?? "No mock analysis is available for this wallet yet."
        );
        return;
      }

      setAnalysis(data);
    } catch {
      setAnalysis(null);
      setErrorMessage("Something went wrong while loading the sample wallet.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isCancelled = false;

    async function generateMemo() {
      if (!analysis) {
        setMemoState(null);
        return;
      }

      const nextMemo = await buildReviewMemo(analysis);

      if (!isCancelled) {
        setMemoState(nextMemo);
      }
    }

    generateMemo();

    return () => {
      isCancelled = true;
    };
  }, [analysis]);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto flex max-w-4xl flex-col px-6 py-20">
        <header className="mb-12">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-slate-500">
            Solana-native trust infrastructure
          </p>
          <h1 className="mb-4 text-5xl font-semibold tracking-tight">
            Atlas Due
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            Assess Solana settlement wallets, surface key risk signals, generate
            concise review memos, and anchor review records onchain.
          </p>
        </header>

        <SearchCard
          walletAddress={walletAddress}
          onWalletAddressChange={setWalletAddress}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
        />

        <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-600">
            <span className="font-medium text-slate-900">Flow:</span> Wallet input →
            Analysis → Review memo → Onchain attestation
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">Sample wallets</h2>
          <div className="flex flex-wrap gap-3">
            {SAMPLE_WALLETS.map((wallet) => (
              <button
                key={wallet.label}
                type="button"
                onClick={() => handleSelectSampleWallet(wallet.address)}
                disabled={isLoading}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {wallet.label}
              </button>
            ))}
          </div>
        </section>

        {analysis ? (
          <>
            <AnalysisPanel analysis={analysis} />
            {memoState ? <MemoPanel memo={memoState} /> : null}
          </>
        ) : errorMessage ? (
          <section className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
            {errorMessage}
          </section>
        ) : walletAddress ? (
          <section className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
            No mock analysis is available for this wallet yet. For now, use one
            of the sample wallets to preview Atlas Due.
          </section>
        ) : (
          <section className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
            No analysis loaded yet. Choose a sample wallet or paste an address
            and click Analyze.
          </section>
        )}

        <footer className="mt-12 pt-10 text-sm text-slate-500">
          Trust infrastructure for treasury and settlement workflows
        </footer>
      </div>
    </main>
  );
}