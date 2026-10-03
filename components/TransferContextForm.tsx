import type { TransferContext } from "@/types/review";

type TransferContextFormProps = {
    value: TransferContext;
    onChange: (value: TransferContext) => void;
};

export function TransferContextForm({
    value,
    onChange,
}: TransferContextFormProps) {
    function updateField(
        field: keyof TransferContext,
        nextValue: string
    ) {
        onChange({
            ...value,
            [field]: nextValue,
        });
    }

    return (
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
                <p className="text-sm uppercase tracking-wide text-slate-500">
                    Transfer context
                </p>

                <h2 className="mt-1 text-xl font-semibold text-slate-900">
                    What payment are you reviewing?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                    Atlas Due evaluates a recipient in the context of a proposed
                    payment, rather than treating a wallet as universally safe or unsafe.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                    Counterparty label
                    <input
                        value={value.counterpartyLabel}
                        onChange={(event) =>
                            updateField("counterpartyLabel", event.target.value)
                        }
                        placeholder="e.g. Acme Liquidity"
                        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                    />
                </label>

                <label className="text-sm font-medium text-slate-700">
                    Asset
                    <input
                        value={value.asset}
                        onChange={(event) =>
                            updateField("asset", event.target.value)
                        }
                        placeholder="USDC"
                        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                    />
                </label>

                <label className="text-sm font-medium text-slate-700">
                    Amount
                    <input
                        value={value.amount}
                        onChange={(event) =>
                            updateField("amount", event.target.value)
                        }
                        placeholder="2500"
                        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                    />
                </label>

                <label className="text-sm font-medium text-slate-700">
                    Payment purpose
                    <input
                        value={value.purpose}
                        onChange={(event) =>
                            updateField("purpose", event.target.value)
                        }
                        placeholder="vendor-payout"
                        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                    />
                </label>
            </div>
        </section>
    );
}