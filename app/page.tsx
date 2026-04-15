"use client";

import { useState } from "react";
import { SearchCard } from "@/components/SearchCard";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import { MemoPanel } from "@/components/MemoPanel";
import { SAMPLE_WALLETS } from "@/lib/constants";
import { mockAnalysisResults } from "@/lib/mock-analysis";
import type { AnalysisResult } from "@/types/analysis";

function getMockAnalysis(walletAddress: string): AnalysisResult | null {
  if (walletAddress === SAMPLE_WALLETS[0].address) {
    return mockAnalysisResults.low;
  }

  if (walletAddress === SAMPLE_WALLETS[1].address) {
    return mockAnalysisResults.moderate;
  }

  if (walletAddress === SAMPLE_WALLETS[2].address) {
    return mockAnalysisResults.elevated;
  }

  return null;
}

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [showMemo, setShowMemo] = useState(false);

  const handleAnalyze = () => {
    const result = getMockAnalysis(walletAddress);
    setAnalysis(result);
    setShowMemo(false);
  };

  const handleSelectSampleWallet = (address: string) => {
    setWalletAddress(address);
    const result = getMockAnalysis(address);
    setAnalysis(result);
    setShowMemo(false);
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto flex max-w-4xl flex-col px-6 py-20">
        <header className="mb-12">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-slate-500">
            Solana-native diligence infrastructure
          </p>
          <h1 className="mb-4 text-5xl font-semibold tracking-tight">
            Atlas Due
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            A diligence and trust layer for digital assets — analyse wallets,
            surface risk signals, generate concise memos, and anchor review
            records onchain.
          </p>
        </header>

        <SearchCard
          walletAddress={walletAddress}
          onWalletAddressChange={setWalletAddress}
          onAnalyze={handleAnalyze}
        />

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">Sample wallets</h2>
          <div className="flex flex-wrap gap-3">
            {SAMPLE_WALLETS.map((wallet) => (
              <button
                key={wallet.label}
                type="button"
                onClick={() => handleSelectSampleWallet(wallet.address)}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                {wallet.label}
              </button>
            ))}
          </div>
        </section>

        {analysis ? (
          <>
            <AnalysisPanel analysis={analysis} />

            <section className="mt-8">
              <button
                type="button"
                onClick={() => setShowMemo((prev) => !prev)}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                {showMemo ? "Hide memo" : "Generate memo"}
              </button>
            </section>

            {showMemo ? <MemoPanel analysis={analysis} /> : null}
          </>
        ) : (
          <section className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
            No analysis loaded yet. Choose a sample wallet or paste an address and click Analyze.
          </section>
        )}

        <footer className="mt-12 pt-10 text-sm text-slate-500">
          Solana-native diligence infrastructure
        </footer>
      </div>
    </main>
  );
}