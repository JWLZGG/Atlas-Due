import { AnchorProvider, Program, setProvider } from "@anchor-lang/core";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import type { Connection } from "@solana/web3.js";

import idl from "@/lib/idl/atlas_due_program.json";
import type { OnchainReviewRecord } from "@/types/review-record";

export async function fetchReviewRecord(
    connection: Connection,
    wallet: WalletContextState,
    reviewPda: string
): Promise<OnchainReviewRecord> {
    const provider = new AnchorProvider(connection, wallet as any, {});
    setProvider(provider);

    const program = new Program(idl as any, provider);
    const accountClient = (program.account as any).reviewRecord;
    const account = await accountClient.fetch(reviewPda);

    const memoHashBytes = Array.from(account.memoHash as Uint8Array);

    return {
        subjectWallet: account.subjectWallet.toBase58(),
        reviewer: account.reviewer.toBase58(),
        memoHashHex: memoHashBytes
            .map((byte) => Number(byte).toString(16).padStart(2, "0"))
            .join(""),
        status: Number(account.status),
        createdAt: Number(account.createdAt),
        updatedAt: Number(account.updatedAt),
        bump: Number(account.bump),
    };
}