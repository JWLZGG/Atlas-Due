export default function Home() {
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
            surface risk signals, generate concise memos and anchor review
            records onchain.
          </p>
        </header>

        <section className="mb-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <label
            htmlFor="wallet"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Enter a Solana wallet address
          </label>
          <input
            id="wallet"
            type="text"
            placeholder="Paste wallet address here"
            className="mb-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-500"
          />

          <button
            type="button"
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Analyze
          </button>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">Sample wallets</h2>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Low-risk example
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Moderate-risk example
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Elevated-risk example
            </button>
          </div>
        </section>

        <footer className="mt-auto pt-10 text-sm text-slate-500">
          Solana-native diligence infrastructure
        </footer>
      </div>
    </main>
  );
}