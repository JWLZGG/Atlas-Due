import {
    Connection,
    PublicKey,
    clusterApiUrl,
    LAMPORTS_PER_SOL,
    ConfirmedSignatureInfo,
} from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

type LiveHolding = {
    symbol: string;
    amount: number;
    usdValue: number;
};

export type RecentActivitySnapshot = {
    signatureCount: number;
    mostRecentBlockTime: number | null;
    oldestFetchedBlockTime: number | null;
};

export function isProbablyRealSolanaWallet(address: string): boolean {
    try {
        new PublicKey(address);
        return true;
    } catch {
        return false;
    }
}

export async function getSolBalanceLamports(address: string): Promise<number> {
    const publicKey = new PublicKey(address);
    return connection.getBalance(publicKey);
}

export function lamportsToSol(lamports: number): number {
    return lamports / LAMPORTS_PER_SOL;
}

function shortenMint(mint: string): string {
    return `${mint.slice(0, 4)}...${mint.slice(-4)}`;
}

function roundAmount(value: number, decimals = 6): number {
    return Number(value.toFixed(decimals));
}

export async function getLiveHoldings(address: string): Promise<LiveHolding[]> {
    const publicKey = new PublicKey(address);

    const solLamports = await connection.getBalance(publicKey);
    const solAmount = lamportsToSol(solLamports);

    const holdings: LiveHolding[] = [];

    if (solAmount > 0) {
        holdings.push({
            symbol: "SOL",
            amount: roundAmount(solAmount),
            usdValue: roundAmount(solAmount), // placeholder proxy for now
        });
    }

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        {
            programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        }
    );

    for (const tokenAccount of tokenAccounts.value) {
        const parsedInfo = tokenAccount.account.data.parsed.info;
        const tokenAmountInfo = parsedInfo.tokenAmount;

        const rawAmount = Number(tokenAmountInfo.uiAmount ?? 0);
        if (!rawAmount || rawAmount <= 0) continue;

        const mint = parsedInfo.mint as string;

        holdings.push({
            symbol: shortenMint(mint),
            amount: roundAmount(rawAmount),
            usdValue: roundAmount(rawAmount), // placeholder proxy for now
        });
    }

    return holdings;
}

export function addConcentrationPercentages(
    holdings: LiveHolding[]
): Array<LiveHolding & { concentrationPct: number }> {
    const total = holdings.reduce((sum, holding) => sum + holding.usdValue, 0);

    if (total === 0) {
        return holdings.map((holding) => ({
            ...holding,
            concentrationPct: 0,
        }));
    }

    return holdings.map((holding) => ({
        ...holding,
        concentrationPct: Number(((holding.usdValue / total) * 100).toFixed(1)),
    }));
}

export async function getRecentSignatures(
    address: string,
    limit = 10
): Promise<ConfirmedSignatureInfo[]> {
    const publicKey = new PublicKey(address);
    return connection.getSignaturesForAddress(publicKey, { limit });
}

export function buildRecentActivitySnapshot(
    signatures: ConfirmedSignatureInfo[]
): RecentActivitySnapshot {
    if (signatures.length === 0) {
        return {
            signatureCount: 0,
            mostRecentBlockTime: null,
            oldestFetchedBlockTime: null,
        };
    }

    const blockTimes = signatures
        .map((sig) => sig.blockTime)
        .filter((time): time is number => time !== null);

    return {
        signatureCount: signatures.length,
        mostRecentBlockTime: blockTimes.length > 0 ? Math.max(...blockTimes) : null,
        oldestFetchedBlockTime: blockTimes.length > 0 ? Math.min(...blockTimes) : null,
    };
}

export function formatRecentActivitySummary(
    snapshot: RecentActivitySnapshot
): string {
    if (snapshot.signatureCount === 0) {
        return "No recent transaction signatures were found in the current live preview window.";
    }

    const latest = snapshot.mostRecentBlockTime
        ? new Date(snapshot.mostRecentBlockTime * 1000).toLocaleString()
        : "unknown";

    const oldest = snapshot.oldestFetchedBlockTime
        ? new Date(snapshot.oldestFetchedBlockTime * 1000).toLocaleString()
        : "unknown";

    return `Recent live preview includes ${snapshot.signatureCount} fetched transaction signature(s), ranging from ${oldest} to ${latest}. Deeper transaction pattern analysis is planned next.`;
}