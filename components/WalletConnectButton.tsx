"use client";

import dynamic from "next/dynamic";

const WalletMultiButtonNoSSR = dynamic(
    async () => {
        const mod = await import("@solana/wallet-adapter-react-ui");
        return mod.WalletMultiButton;
    },
    {
        ssr: false,
        loading: () => (
            <div className="h-[48px] min-w-[160px] rounded-xl bg-slate-100" />
        ),
    }
);

export function WalletConnectButton() {
    return (
        <WalletMultiButtonNoSSR className="!h-auto !rounded-xl !bg-slate-900 !px-4 !py-3 !text-sm !font-medium hover:!bg-slate-700" />
    );
}