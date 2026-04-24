import { formatPercent } from "../../../../shared/utils/formatters";
import type { DashboardSnapshot } from "../../../../types/dashboard/DashboardSnapshot";
import { SurfaceCard } from "../../../../shared/components/SurfaceCard";
import { Tooltip } from "../../../../shared/components/Tooltip";
import { formatOverviewIota } from "../../utils/validators.utils";

type Props = {
  snapshot: DashboardSnapshot;
};

export function ValidatorsSummaryCards({ snapshot }: Props) {
  const summaryCards = [
    {
      label: "Total Staked",
      value: formatOverviewIota(snapshot.staking.totalStaked),
    },
    {
      label: "Staking Ratio",
      value: formatPercent(snapshot.staking.stakingRatio, 2),
      tooltip: "% of total supply staked.",
    },
    {
      label: "Total Gas Fees (last completed epoch)",
      value: formatOverviewIota(snapshot.staking.lastEpochGasFees),
      tooltip:
        "Sum of gas fees recorded in end-of-epoch info (not a direct staking rewards payout metric).",
    },
  ];

  return (
    <SurfaceCard title="Network Overview">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map((item) => (
          <div
            key={item.label}
            className="rounded-[1.15rem] border border-slate-500/70 bg-[linear-gradient(155deg,#d1dae3,#c5d0c8)] px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] dark:border-emerald-200/15 dark:bg-[radial-gradient(circle_at_18%_18%,rgba(134,239,172,0.08),transparent_55%),linear-gradient(155deg,#0a1813,#0f1f19)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_12px_36px_rgba(2,12,27,0.26)] text-slate-900 dark:text-white"
          >
            <p
              className="text-left text-[0.68rem] font-medium tracking-tight text-slate-700 dark:text-slate-200"
            >
              <Tooltip content={item.tooltip}>{item.label}</Tooltip>
            </p>
            <p
              className="mt-5 text-right text-[1.5rem] font-semibold leading-none text-slate-800 dark:text-white"
            >
              <Tooltip content={item.tooltip}>{item.value}</Tooltip>
            </p>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}
