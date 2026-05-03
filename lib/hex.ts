export function hexToBytes32(hex: string): number[] {
    const normalized = hex.startsWith("0x") ? hex.slice(2) : hex;

    if (normalized.length !== 64) {
        throw new Error("Expected a 32-byte hex string (64 hex characters).");
    }

    const bytes: number[] = [];

    for (let i = 0; i < normalized.length; i += 2) {
        bytes.push(parseInt(normalized.slice(i, i + 2), 16));
    }

    if (bytes.length !== 32) {
        throw new Error("Hex string did not convert to 32 bytes.");
    }

    return bytes;
}