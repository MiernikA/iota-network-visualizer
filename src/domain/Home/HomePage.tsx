import { formatShortHash } from "../../shared/utils/formatters";
import type { DashboardSnapshot } from "../../types/dashboard/DashboardSnapshot";
import { GlobePanel } from "./components/globe/GlobePanel";
import { useHomeViewModel } from "./data/useHomeViewModel";
import { SurfaceCard } from "../../shared/components/SurfaceCard";

type Props = {
  snapshot: DashboardSnapshot;
  updatedAt: number | null;
};

async function copyToClipboard(value: string) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand("copy");
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

function formatRelativeTimestamp(timestampMs: number): string {
  const deltaSeconds = Math.max(
    Math.floor((Date.now() - timestampMs) / 1000),
    0,
  );

  if (deltaSeconds < 60) {
    return `${deltaSeconds}s ago`;
  }

  const minutes = Math.floor(deltaSeconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export function HomePage({
  snapshot,
  updatedAt,
}: Props) {
  const { overviewMetrics, performanceMetrics, activityMetrics } =
    useHomeViewModel(snapshot);

  return (
    <div className="space-y-6">
      <section aria-label="Hero">
        <GlobePanel
          validators={snapshot.validators}
          updatedAt={updatedAt}
          overviewMetrics={overviewMetrics}
          performanceMetrics={performanceMetrics}
          activityMetrics={activityMetrics}
        />
      </section>

      <SurfaceCard title="Recent Checkpoints">
        <div className="overflow-hidden rounded-[1.2rem] border border-slate-500/70 bg-[linear-gradient(180deg,#d4dde6,#cad4cd,#c0cbc3)] dark:border-white/12 dark:bg-[radial-gradient(circle_at_10%_10%,rgba(134,239,172,0.06),transparent_28%),linear-gradient(180deg,#050c13,#0a1612,#0f172a)]">
          <div className="app-scrollbar max-h-[24rem] overflow-auto">
            <table className="bg-[linear-gradient(180deg,#e4eaf1,#dae3dc)] dark:bg-[linear-gradient(180deg,#091019,#0c1512)] min-w-full text-left">
              <thead
                className="bg-[linear-gradient(180deg,#c8d1db,#bec9c2)] text-slate-800 dark:bg-[linear-gradient(180deg,#08120f,#0a1612)] dark:text-slate-400 sticky top-0 z-10 text-xs uppercase tracking-[0.16em]"
              >
                <tr>
                  <th className="px-4 py-3">Checkpoint ID</th>
                  <th className="px-4 py-3">Transactions</th>
                  <th className="px-4 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.recentCheckpoints.map((checkpoint) => (
                  <tr
                    key={checkpoint.id}
                    className="border-t border-slate-200 bg-[linear-gradient(180deg,#e8edf3,#dde6df)] text-sm text-slate-700 transition hover:bg-[linear-gradient(180deg,#dce3eb,#d2ddd5)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200/50 dark:border-white/10 dark:bg-[linear-gradient(180deg,#0d1520,#0f1915)] dark:text-slate-200 dark:hover:bg-[linear-gradient(180deg,#10211a,#11231c)] dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span title={checkpoint.id}>
                          {formatShortHash(checkpoint.id, 8)}
                        </span>
                        <button
                          type="button"
                          className="cursor-copy rounded-md border border-slate-300/70 px-2 py-1 text-[0.68rem] font-medium text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600 dark:border-white/10 dark:text-slate-300 dark:hover:border-emerald-300/40 dark:hover:text-emerald-200"
                          onClick={() => void copyToClipboard(checkpoint.id)}
                          aria-label={`Copy full checkpoint id ${checkpoint.id}`}
                          title="Copy full checkpoint ID"
                        >
                          Copy
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {checkpoint.transactionsCount}
                    </td>
                    <td className="px-4 py-3">
                      {formatRelativeTimestamp(checkpoint.timestampMs)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SurfaceCard>
    </div>
  );
}
