type SearchCardProps = {
    walletAddress: string;
    onWalletAddressChange: (value: string) => void;
    onAnalyze: () => void;
};

export function SearchCard({
    walletAddress,
    onWalletAddressChange,
    onAnalyze,
}: SearchCardProps) {
    return (
        <section className="mb-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <label
                htmlFor="wallet"
                className="mb-2 block text-sm font-medium text-slate-700"
            >
                Enter a Solana wallet address
            </label>

            <p className="mb-3 text-xs text-slate-500">
                Use a sample wallet for this preview build.
            </p>

            <input
                id="wallet"
                type="text"
                value={walletAddress}
                onChange={(e) => onWalletAddressChange(e.target.value)}
                placeholder="Paste wallet address here"
                className="mb-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-500"
            />

            <button
                type="button"
                onClick={onAnalyze}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
                Analyze
            </button>
        </section>
    );
}