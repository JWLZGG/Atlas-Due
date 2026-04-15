"use client";

import { useState } from "react";
import { SearchCard } from "@/components/SearchCard";
import { SAMPLE_WALLETS } from "@/lib/constants";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto flex max-w-4xl flex-col px-6 py-20">
        <header className="mb-12">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-slate-500">
            Solana-native diligence infrastructure
          </p>
          <h1 className="mb-4 text-5xl font-semibold tracking-tight">
            Atlas Due
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            A diligence and trust layer for digital assets — analyse wallets,
            surface risk signals, generate concise memos, and anchor review
            records onchain.
          </p>
        </header>

        <SearchCard
          walletAddress={walletAddress}
          onWalletAddressChange={setWalletAddress}
        />

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">Sample wallets</h2>
          <div className="flex flex-wrap gap-3">
            {SAMPLE_WALLETS.map((wallet) => (
              <button
                key={wallet.label}
                type="button"
                onClick={() => setWalletAddress(wallet.address)}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                {wallet.label}
              </button>
            ))}
          </div>
        </section>

        <footer className="mt-auto pt-10 text-sm text-slate-500">
          Solana-native diligence infrastructure
        </footer>
      </div>
    </main>
  );
}