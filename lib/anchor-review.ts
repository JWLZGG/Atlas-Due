import { AnchorProvider, Program, setProvider } from "@anchor-lang/core";
import { PublicKey, SystemProgram, Connection } from "@solana/web3.js";
import type { WalletContextState } from "@solana/wallet-adapter-react";

import idl from "@/lib/idl/atlas_due_program.json";
import { ATLAS_DUE_PROGRAM_ID } from "@/lib/program";
import { deriveReviewPda } from "@/lib/pda";
import { hexToBytes32 } from "@/lib/hex";
import { reviewStatusToU8 } from "@/lib/review-status";
import { reviewRecordExists } from "@/lib/review-record";
import type { AttestationPayload } from "@/types/attestation";

type CreateReviewResult = {
    signature: string;
    reviewPda: string;
    mode: "create" | "update";
};

export async function createProgramBackedReview(
    connection: Connection,
    wallet: WalletContextState,
    payload: AttestationPayload
): Promise<CreateReviewResult> {
    if (!wallet.publicKey) {
        throw new Error("Wallet public key is not available.");
    }

    const provider = new AnchorProvider(connection, wallet as any, {});
    setProvider(provider);

    const program = new Program(idl as any, provider);

    const subjectWallet = new PublicKey(payload.subjectWallet);
    const reviewer = wallet.publicKey;

    const [reviewPda] = deriveReviewPda(
        ATLAS_DUE_PROGRAM_ID,
        reviewer,
        subjectWallet
    );

    const memoHashBytes = hexToBytes32(payload.memoHash);
    const statusU8 = reviewStatusToU8(payload.reviewStatus);

    const exists = await reviewRecordExists(connection, reviewPda);

    let signature: string;
    let mode: "create" | "update";

    if (!exists) {
        signature = await program.methods
            .createReview(subjectWallet, memoHashBytes, statusU8)
            .accounts({
                reviewRecord: reviewPda,
                reviewer,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        mode = "create";
    } else {
        signature = await program.methods
            .updateReview(memoHashBytes, statusU8)
            .accounts({
                reviewRecord: reviewPda,
                reviewer,
            })
            .rpc();

        mode = "update";
    }

    return {
        signature,
        reviewPda: reviewPda.toBase58(),
        mode,
    };
}