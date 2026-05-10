"use client";

import { useMemo, useState } from "react";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";

import { fetchReviewRecord } from "@/lib/fetch-review-record";
import type { OnchainReviewRecord } from "@/types/review-record";
import { ReviewRecordPanel } from "@/components/ReviewRecordPanel";

import {
    PublicKey,
    Transaction,
    TransactionInstruction,
} from "@solana/web3.js";

import { createProgramBackedReview } from "@/lib/anchor-review";
import type { AttestationPayload } from "@/types/attestation";
import { devnetAddressUrl, devnetTxUrl } from "@/lib/explorer";

type AttestationActionProps = {
    payload: AttestationPayload | null;
};

export function AttestationAction({ payload }: AttestationActionProps) {
    const { connection } = useConnection();
    const wallet = useWallet();
    const anchorWallet = useAnchorWallet();
    const { connected, publicKey, signMessage, sendTransaction } = wallet;

    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [signedPayloadPreview, setSignedPayloadPreview] = useState<string | null>(null);
    const [transactionSignature, setTransactionSignature] = useState<string | null>(null);
    const [programSignature, setProgramSignature] = useState<string | null>(null);
    const [reviewPda, setReviewPda] = useState<string | null>(null);

    const [onchainRecord, setOnchainRecord] = useState<OnchainReviewRecord | null>(null);
    const [isRefreshingRecord, setIsRefreshingRecord] = useState(false);

    const [isSigning, setIsSigning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isProgramSubmitting, setIsProgramSubmitting] = useState(false);

    const canSign = useMemo(
        () => connected && !!publicKey && !!payload && !!signMessage,
        [connected, publicKey, payload, signMessage]
    );

    const canSubmitMemo = useMemo(
        () => connected && !!publicKey && !!payload && !!sendTransaction,
        [connected, publicKey, payload, sendTransaction]
    );

    const canSubmitProgramReview = useMemo(
        () => !!anchorWallet && !!payload,
        [anchorWallet, payload]
    );

    const handleSignAttestation = async () => {
        if (!payload) {
            setStatusMessage("No attestation payload is available yet.");
            return;
        }

        if (!connected || !publicKey) {
            setStatusMessage("Connect a wallet to sign the attestation payload.");
            return;
        }

        if (!signMessage) {
            setStatusMessage(
                "This wallet does not support message signing in the current session."
            );
            return;
        }

        setIsSigning(true);
        setStatusMessage(null);
        setSignedPayloadPreview(null);

        try {
            const payloadString = JSON.stringify(payload);
            const encodedMessage = new TextEncoder().encode(payloadString);

            const signatureBytes = await signMessage(encodedMessage);
            const signatureBase58 = bs58.encode(signatureBytes);

            setSignedPayloadPreview(signatureBase58);
            setStatusMessage("Attestation payload signed successfully.");
        } catch (error) {
            setStatusMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to sign attestation payload."
            );
        } finally {
            setIsSigning(false);
        }
    };

    const handleSubmitMemoAttestation = async () => {
        if (!payload) {
            setStatusMessage("No attestation payload is available yet.");
            return;
        }

        if (!connected || !publicKey) {
            setStatusMessage("Connect a wallet to submit the attestation transaction.");
            return;
        }

        if (!sendTransaction) {
            setStatusMessage("This wallet cannot submit transactions in the current session.");
            return;
        }

        setIsSubmitting(true);
        setStatusMessage(null);
        setTransactionSignature(null);

        try {
            const { Transaction, TransactionInstruction, PublicKey } = await import(
                "@solana/web3.js"
            );

            const memoString = JSON.stringify({
                subjectWallet: payload.subjectWallet,
                memoHash: payload.memoHash,
                reviewStatus: payload.reviewStatus,
                generatedAt: payload.generatedAt,
                reviewLabel: payload.reviewLabel,
            });

            const memoInstruction = new TransactionInstruction({
                keys: [],
                programId: new PublicKey(
                    "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
                ),
                data: Buffer.from(memoString, "utf8"),
            });

            const transaction = new Transaction().add(memoInstruction);
            transaction.feePayer = publicKey;

            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, "confirmed");

            setTransactionSignature(signature);
            setStatusMessage("Devnet memo attestation submitted successfully.");
        } catch (error) {
            setStatusMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to submit attestation transaction."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRefreshReviewRecord = async (pda: string) => {
        setIsRefreshingRecord(true);

        try {
            const record = await fetchReviewRecord(connection, wallet, pda);
            setOnchainRecord(record);
        } catch (error) {
            setStatusMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to fetch the onchain review record."
            );
        } finally {
            setIsRefreshingRecord(false);
        }
    };

    const handleSubmitProgramReview = async () => {
        if (!payload) {
            setStatusMessage("No attestation payload is available yet.");
            return;
        }

        if (!anchorWallet) {
            setStatusMessage("Connect a compatible wallet to submit the program-backed review.");
            return;
        }

        setIsProgramSubmitting(true);
        setStatusMessage(null);
        setProgramSignature(null);
        setReviewPda(null);

        try {
            const result = await createProgramBackedReview(connection, wallet, payload);

            setProgramSignature(result.signature);
            setReviewPda(result.reviewPda);
            setStatusMessage(
                result.mode === "create"
                    ? "Onchain review record created on Devnet."
                    : "Onchain review record updated on Devnet."
            );
            await handleRefreshReviewRecord(result.reviewPda);
        } catch (error) {
            setStatusMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to create the program-backed review."
            );
        } finally {
            setIsProgramSubmitting(false);
        }
    };

    return (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
                <p className="text-sm uppercase tracking-wide text-slate-500">
                    Devnet attestation
                </p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">
                    Sign and submit attestation
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                    First sign the payload, then use either the memo bridge step or the
                    program-backed review path on Devnet.
                </p>
                <p className="mt-2 text-xs text-slate-500">
                    Program-backed review records are written to Solana Devnet in this prototype.
                </p>
            </div>

            <p className="mb-3 text-xs uppercase tracking-wide text-slate-500">
                Actions
            </p>

            <div className="flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={handleSignAttestation}
                    disabled={!canSign || isSigning}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                    {isSigning ? "Signing..." : "Sign attestation payload"}
                </button>

                <button
                    type="button"
                    onClick={handleSubmitMemoAttestation}
                    disabled={!canSubmitMemo || isSubmitting}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                    {isSubmitting ? "Submitting..." : "Submit Devnet memo attestation"}
                </button>

                <button
                    type="button"
                    onClick={handleSubmitProgramReview}
                    disabled={!canSubmitProgramReview || isProgramSubmitting}
                    className="rounded-xl border border-slate-900 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                    {isProgramSubmitting ? "Submitting..." : "Create program-backed review"}
                </button>
            </div>

            {statusMessage || signedPayloadPreview || transactionSignature || programSignature || reviewPda ? (
                <div className="mt-6">
                    <p className="mb-3 text-xs uppercase tracking-wide text-slate-500">
                        Latest result
                    </p>
                </div>
            ) : null}

            {statusMessage ? (
                <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                    {statusMessage}
                </p>
            ) : null}

            {signedPayloadPreview ? (
                <div className="mt-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                        Signature preview
                    </p>
                    <p className="mt-2 break-all rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700">
                        {signedPayloadPreview}
                    </p>
                </div>
            ) : null}

            {transactionSignature ? (
                <div className="mt-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                        Devnet memo transaction signature
                    </p>
                    <p className="mt-2 break-all rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700">
                        {transactionSignature}
                    </p>
                    <a
                        href={devnetTxUrl(transactionSignature)}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-sm text-slate-600 underline hover:text-slate-900"
                    >
                        View transaction on explorer
                    </a>
                </div>
            ) : null}

            {programSignature ? (
                <div className="mt-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                        Program-backed transaction signature
                    </p>
                    <p className="mt-2 break-all rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700">
                        {programSignature}
                    </p>
                    <a
                        href={devnetTxUrl(programSignature)}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-sm text-slate-600 underline hover:text-slate-900"
                    >
                        View transaction on explorer
                    </a>
                </div>
            ) : null}

            {reviewPda ? (
                <div className="mt-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                        Derived review PDA
                    </p>
                    <p className="mt-2 break-all rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700">
                        {reviewPda}
                    </p>

                    <button
                        type="button"
                        onClick={() => handleRefreshReviewRecord(reviewPda)}
                        disabled={isRefreshingRecord}
                        className="mt-3 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                        {isRefreshingRecord ? "Refreshing..." : "Refresh onchain review record"}
                    </button>

                    <a
                        href={devnetAddressUrl(reviewPda)}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-sm text-slate-600 underline hover:text-slate-900"
                    >
                        View PDA on explorer
                    </a>
                </div>
            ) : null}

            {reviewPda ? (
                <p className="mt-6 mb-3 text-xs uppercase tracking-wide text-slate-500">
                    Onchain record
                </p>
            ) : null}

            {reviewPda && onchainRecord ? (
                <ReviewRecordPanel reviewPda={reviewPda} record={onchainRecord} />
            ) : null}
        </section>
    );
}