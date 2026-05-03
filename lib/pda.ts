import { PublicKey } from "@solana/web3.js";

export function deriveReviewPda(
    programId: PublicKey,
    reviewer: PublicKey,
    subjectWallet: PublicKey
): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("review"),
            reviewer.toBuffer(),
            subjectWallet.toBuffer(),
        ],
        programId
    );
}