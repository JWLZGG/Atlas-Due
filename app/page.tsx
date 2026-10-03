"use client";

import Link from "next/link";
import { TransferContextForm } from "@/components/TransferContextForm";
import type {
  TransferContext,
  ReviewDecision,
  SavedReview,
} from "@/types/review";
import { useEffect, useState } from "react";
import { WalletConnectButton } from "@/components/WalletConnectButton";
import { DecisionPanel } from "@/components/DecisionPanel";

import { SearchCard } from "@/components/SearchCard";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import { ReviewStatusSelector } from "@/components/ReviewStatusSelector";
import { AttestationAction } from "@/components/AttestationAction";
import { MemoPanel } from "@/components/MemoPanel";

import { SAMPLE_WALLETS } from "@/lib/constants";
import { buildReviewMemo } from "@/lib/build-review-memo";
import { buildAttestationPayload } from "@/lib/build-attestation-payload";

import type { AnalysisResult, ReviewStatus } from "@/types/analysis";
import type { ReviewMemo } from "@/types/memo";
import type { AttestationPayload } from "@/types/attestation";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [transferContext, setTransferContext] =
    useState<TransferContext>({
      counterpartyLabel: "",
      asset: "USDC",
      amount: "",
      purpose: "",
    });
  const [decision, setDecision] =
    useState<ReviewDecision | null>(null);

  const [rationale, setRationale] = useState("");

  const [expiresAt, setExpiresAt] = useState("");

  const [savedReview, setSavedReview] =
    useState<SavedReview | null>(null);

  const [isSavingReview, setIsSavingReview] =
    useState(false);

  const [saveReviewError, setSaveReviewError] =
    useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [memo, setMemo] = useState<ReviewMemo | null>(null);
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>("pending");
  const [attestationPayload, setAttestationPayload] =
    useState<AttestationPayload | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function fetchAnalysis(address: string) {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletAddress: address }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ?? "No analysis is available for this wallet yet."
      );
    }

    return data as AnalysisResult;
  }

  const handleAnalyze = async () => {
    const trimmedWallet = walletAddress.trim();

    if (!trimmedWallet) {
      setAnalysis(null);
      setMemo(null);
      setAttestationPayload(null);
      setErrorMessage("Please enter a wallet address.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const nextAnalysis = await fetchAnalysis(trimmedWallet);
      setAnalysis(nextAnalysis);
    } catch (error) {
      setAnalysis(null);
      setMemo(null);
      setAttestationPayload(null);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while analyzing this wallet."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSampleWallet = async (address: string) => {
    setWalletAddress(address);
    setAnalysis(null);
    setMemo(null);
    setAttestationPayload(null);
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const nextAnalysis = await fetchAnalysis(address);
      setAnalysis(nextAnalysis);
    } catch (error) {
      setAnalysis(null);
      setMemo(null);
      setAttestationPayload(null);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while loading the sample wallet."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isCancelled = false;

    async function generateMemo() {
      if (!analysis) {
        setMemo(null);
        return;
      }

      const nextMemo = await buildReviewMemo(analysis);

      if (!isCancelled) {
        setMemo(nextMemo);
      }
    }

    generateMemo();

    return () => {
      isCancelled = true;
    };
  }, [analysis]);

  useEffect(() => {
    if (!memo) {
      setAttestationPayload(null);
      return;
    }

    const payload = buildAttestationPayload(memo, reviewStatus);
    setAttestationPayload(payload);
  }, [memo, reviewStatus]);

  async function handleSaveReview() {
    if (!analysis) {
      setSaveReviewError("Analyze the recipient before saving a review.");
      return;
    }

    if (!transferContext.counterpartyLabel.trim()) {
      setSaveReviewError("Enter a counterparty label.");
      return;
    }

    if (!transferContext.asset.trim()) {
      setSaveReviewError("Enter an asset.");
      return;
    }

    if (!transferContext.amount.trim()) {
      setSaveReviewError("Enter an amount.");
      return;
    }

    if (!transferContext.purpose.trim()) {
      setSaveReviewError("Enter a payment purpose.");
      return;
    }

    if (!decision) {
      setSaveReviewError("Select approve, reject, or escalate.");
      return;
    }

    if (!rationale.trim()) {
      setSaveReviewError("Enter a rationale for the decision.");
      return;
    }

    if (decision === "approved" && !expiresAt) {
      setSaveReviewError("Approved reviews require an expiry date.");
      return;
    }

    setIsSavingReview(true);
    setSaveReviewError(null);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientAddress: analysis.summary.walletAddress,
          counterpartyLabel:
            transferContext.counterpartyLabel.trim(),
          asset: transferContext.asset.trim(),
          amount: transferContext.amount.trim(),
          purpose: transferContext.purpose.trim(),

          analysis,

          decision,
          rationale: rationale.trim(),
          expiresAt: expiresAt || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? "Failed to save review."
        );
      }

      setSavedReview(data.review);
    } catch (error) {
      setSaveReviewError(
        error instanceof Error
          ? error.message
          : "Failed to save review."
      );
    } finally {
      setIsSavingReview(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col px-6 py-16">
        <header className="mb-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-wider text-slate-500">
                Solana-native trust infrastructure
              </p>
              <h1 className="mb-4 text-5xl font-semibold tracking-tight">
                Atlas Due
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Assess Solana settlement wallets, surface key risk signals,
                generate concise review memos, and anchor review records
                onchain.
              </p>
            </div>

            <WalletConnectButton />
          </div>
        </header>

        <div className="mt-6 mb-6 flex flex-wrap gap-3">
          <a
            href="#review-workflow"
            className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white"
          >
            New recipient review
          </a>

          <Link
            href="/registry"
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700"
          >
            View registry
          </Link>

          <Link
            href="/precheck-demo"
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700"
          >
            Precheck API demo
          </Link>
        </div>

        <div id="review-workflow">
          <SearchCard
            walletAddress={walletAddress}
            onWalletAddressChange={setWalletAddress}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
          />
        </div>

        <TransferContextForm
          value={transferContext}
          onChange={setTransferContext}
        />

        <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-600">
            <span className="font-medium text-slate-900">Flow:</span> Wallet
            input → Analysis → Review memo → Onchain attestation
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

            <DecisionPanel
              decision={decision}
              rationale={rationale}
              expiresAt={expiresAt}
              onDecisionChange={setDecision}
              onRationaleChange={setRationale}
              onExpiresAtChange={setExpiresAt}
              onSave={handleSaveReview}
              isSaving={isSavingReview}
              saveError={saveReviewError}
            />

            {savedReview ? (
              <section className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
                  Review saved
                </p>

                <h2 className="mt-1 text-xl font-semibold text-emerald-950">
                  {savedReview.decision}
                </h2>

                <p className="mt-3 text-sm text-emerald-900">
                  Review ID: {savedReview.id}
                </p>

                <p className="mt-1 text-sm text-emerald-900">
                  Policy: {savedReview.policyVersion}
                </p>

                {savedReview.expiresAt ? (
                  <p className="mt-1 text-sm text-emerald-900">
                    Expires:{" "}
                    {new Date(savedReview.expiresAt).toLocaleDateString()}
                  </p>
                ) : null}
              </section>
            ) : null}

            <ReviewStatusSelector
              value={reviewStatus}
              onChange={setReviewStatus}
            />

            <AttestationAction payload={attestationPayload} />

            {memo ? (
              <MemoPanel
                memo={memo}
                attestationPayload={attestationPayload}
              />
            ) : null}
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