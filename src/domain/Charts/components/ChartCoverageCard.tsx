import { SurfaceCard } from "../../../shared/components/SurfaceCard";
import { formatHistoryWindow } from "../data/utils/charts.utils";

type Props = {
  transactionsWindowMs: number;
  transactionsCount: number;
  finalityWindowMs: number;
  finalityCount: number;
  epochWindowMs: number;
  epochCount: number;
};

export function ChartCoverageCard({
  transactionsWindowMs,
  transactionsCount,
  finalityWindowMs,
  finalityCount,
  epochWindowMs,
  epochCount,
}: Props) {
  return (
    <SurfaceCard className="rounded-[1.45rem] px-4 py-4">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-600 dark:text-white">
        Data Coverage
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-200">
        This charts page uses the current live dashboard snapshot. Transaction
        and throughput charts are built from the most recent checkpoint window,
        epoch charts use the latest loaded epoch history, and validator stake or
        APY panels are live snapshots rather than long-range history.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span
          className="border border-slate-500/70 bg-[linear-gradient(155deg,#d4dde6,#cad4cd,#c0cbc4)] dark:border-white/12 dark:bg-[radial-gradient(circle_at_14%_16%,rgba(134,239,172,0.06),transparent_32%),linear-gradient(155deg,#08120f,#0d1b15,#111827)] rounded-full px-3 py-1.5 text-[0.74rem] font-medium text-slate-700 dark:text-white"
        >
          Checkpoint window: {formatHistoryWindow(transactionsWindowMs)} from{" "}
          {transactionsCount} buckets
        </span>
        <span
          className="border border-slate-500/70 bg-[linear-gradient(155deg,#d4dde6,#cad4cd,#c0cbc4)] dark:border-white/12 dark:bg-[radial-gradient(circle_at_14%_16%,rgba(134,239,172,0.06),transparent_32%),linear-gradient(155deg,#08120f,#0d1b15,#111827)] rounded-full px-3 py-1.5 text-[0.74rem] font-medium text-slate-700 dark:text-white"
        >
          Checkpoint-interval window: {formatHistoryWindow(finalityWindowMs)} from{" "}
          {finalityCount} points
        </span>
        <span
          className="border border-slate-500/70 bg-[linear-gradient(155deg,#d4dde6,#cad4cd,#c0cbc4)] dark:border-white/12 dark:bg-[radial-gradient(circle_at_14%_16%,rgba(134,239,172,0.06),transparent_32%),linear-gradient(155deg,#08120f,#0d1b15,#111827)] rounded-full px-3 py-1.5 text-[0.74rem] font-medium text-slate-700 dark:text-white"
        >
          Epoch history: {epochCount} epochs over{" "}
          {formatHistoryWindow(epochWindowMs)}
        </span>
        <span
          className="border border-slate-500/70 bg-[linear-gradient(155deg,#d4dde6,#cad4cd,#c0cbc4)] dark:border-white/12 dark:bg-[radial-gradient(circle_at_14%_16%,rgba(134,239,172,0.06),transparent_32%),linear-gradient(155deg,#08120f,#0d1b15,#111827)] rounded-full px-3 py-1.5 text-[0.74rem] font-medium text-slate-700 dark:text-white"
        >
          Refresh cadence: every 8 seconds
        </span>
      </div>
    </SurfaceCard>
  );
}
