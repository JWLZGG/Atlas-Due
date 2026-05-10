import { PublicKey, Connection } from "@solana/web3.js";

export async function reviewRecordExists(
    connection: Connection,
    reviewPda: PublicKey
): Promise<boolean> {
    const accountInfo = await connection.getAccountInfo(reviewPda);
    return accountInfo !== null;
}