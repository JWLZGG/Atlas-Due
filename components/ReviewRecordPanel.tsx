import type { OnchainReviewRecord } from "@/types/review-record";
import {
    formatUnixTimestamp,
    statusLabelFromRecord,
} from "@/lib/review-record-format";

type ReviewRecordPanelProps = {
    reviewPda: string;
    record: OnchainReviewRecord;
};

export function ReviewRecordPanel({
    reviewPda,
    record,
}: ReviewRecordPanelProps) {
    return (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
                <p className="text-sm uppercase tracking-wide text-slate-500">
                    Onchain review record
                </p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">
                    PDA-backed review details
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                    This panel shows the current PDA-backed review record fetched from the deployed Atlas Due program on Solana Devnet.
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                        Review PDA
                    </p>
                    <p className="mt-2 break-all rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700">
                        {reviewPda}
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                            Reviewer
                        </p>
                        <p className="mt-2 break-all rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                            {record.reviewer}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                            Subject wallet
                        </p>
                        <p className="mt-2 break-all rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                            {record.subjectWallet}
                        </p>
                    </div>
                </div>

                <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                        Memo hash
                    </p>
                    <p className="mt-2 break-all rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700">
                        {record.memoHashHex}
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                            Status
                        </p>
                        <p className="mt-2 inline-flex rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-sm capitalize text-slate-700">
                            {statusLabelFromRecord(record)}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                            Created at
                        </p>
                        <p className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                            {formatUnixTimestamp(record.createdAt)}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                            Updated at
                        </p>
                        <p className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                            {formatUnixTimestamp(record.updatedAt)}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}