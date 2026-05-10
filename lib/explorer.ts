export function devnetTxUrl(signature: string): string {
    return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
}

export function devnetAddressUrl(address: string): string {
    return `https://explorer.solana.com/address/${address}?cluster=devnet`;
}