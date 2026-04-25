"use client";

import { useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
    Transaction,
    PublicKey,
    TransactionInstruction,
    type TransactionSignature,
} from "@solana/web3.js";
import bs58 from "bs58";

import type { AttestationPayload } from "@/types/attestation";

type AttestationActionProps = {
    payload: AttestationPayload | null;
};

const MEMO_PROGRAM_ID = new PublicKey(
    "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
);

export function AttestationAction({ payload }: AttestationActionProps) {
    const { connection } = useConnection();
    const { connected, publicKey, signMessage, sendTransaction } = useWallet();

    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [signedPayloadPreview, setSignedPayloadPreview] = useState<string | null>(null);
    const [transactionSignature, setTransactionSignature] =
        useState<TransactionSignature | null>(null);
    const [isSigning, setIsSigning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const canSign = useMemo(
        () => connected && !!publicKey && !!payload && !!signMessage,
        [connected, publicKey, payload, signMessage]
    );

    const canSubmit = useMemo(
        () => connected && !!publicKey && !!payload && !!sendTransaction,
        [connected, publicKey, payload, sendTransaction]
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
            setStatusMessage(
                `Attestation payload signed by ${publicKey.toBase58()}.`
            );
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

    const handleSubmitAttestation = async () => {
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
            const memoString = JSON.stringify({
                subjectWallet: payload.subjectWallet,
                memoHash: payload.memoHash,
                reviewStatus: payload.reviewStatus,
                generatedAt: payload.generatedAt,
                reviewLabel: payload.reviewLabel,
            });

            const memoInstruction = new TransactionInstruction({
                keys: [],
                programId: MEMO_PROGRAM_ID,
                data: Buffer.from(memoString, "utf8"),
            });

            const transaction = new Transaction().add(memoInstruction);
            transaction.feePayer = publicKey;

            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, "confirmed");

            setTransactionSignature(signature);
            setStatusMessage(
                `Attestation transaction submitted successfully from ${publicKey.toBase58()}.`
            );
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
                    First sign the attestation payload, then submit a real Devnet memo
                    transaction as the bridge step before a dedicated program-backed
                    record.
                </p>
            </div>

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
                    onClick={handleSubmitAttestation}
                    disabled={!canSubmit || isSubmitting}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                    {isSubmitting ? "Submitting..." : "Submit Devnet attestation"}
                </button>
            </div>

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
                        Devnet transaction signature
                    </p>
                    <p className="mt-2 break-all rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700">
                        {transactionSignature}
                    </p>
                </div>
            ) : null}
        </section>
    );
}