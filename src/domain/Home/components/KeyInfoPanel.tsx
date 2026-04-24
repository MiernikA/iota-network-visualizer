import { Tooltip } from "../../../shared/components/Tooltip";
import type { DetailMetric, OverviewMetric } from "../../../types/globe/panel";

type Props = {
  lastUpdatedLabel: string;
  overviewMetrics: OverviewMetric[];
  performanceMetrics: DetailMetric[];
  activityMetrics: Array<{
    label: string;
    value: string;
  }>;
};

function MetricTile({ metric }: { metric: OverviewMetric }) {
  const accentValue =
    metric.accent === null || !Number.isFinite(metric.accent)
      ? "--"
      : `${metric.accent >= 0 ? "+" : ""}${metric.accent.toFixed(1)}%`;
  const accentTone =
    metric.accent === null || !Number.isFinite(metric.accent)
      ? "bg-slate-400/10 text-slate-300"
      : metric.accent >= 0
        ? "bg-emerald-500/12 text-emerald-300"
        : "bg-rose-500/12 text-rose-300";

  return (
    <div className="border border-slate-500/70 bg-[linear-gradient(155deg,#d4dde6,#cad4cd,#c0cbc4)] dark:border-white/12 dark:bg-[radial-gradient(circle_at_14%_16%,rgba(134,239,172,0.06),transparent_32%),linear-gradient(155deg,#08120f,#0d1b15,#111827)] rounded-[0.85rem] px-3 py-2">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[0.72rem] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          {metric.label}
        </p>
        <Tooltip content={metric.accentTooltip}>
          <span
            className={`inline-flex min-w-14 items-center justify-center rounded-full px-2.5 py-1 text-[0.68rem] font-semibold tracking-[-0.01em] ${accentTone}`}
            aria-label={metric.accentTooltip}
            tabIndex={0}
          >
            {accentValue}
          </span>
        </Tooltip>
      </div>
      <p className="mt-2.5 font-['Space_Grotesk'] text-[1.16rem] font-semibold text-slate-900 dark:text-white">
        {metric.value}
      </p>
    </div>
  );
}

function DetailMetricTile({
  label,
  value,
  section,
  isFullWidth,
}: DetailMetric & {
  section: string;
  isFullWidth: boolean;
}) {
  return (
    <div
      className={`border border-slate-500/70 bg-[linear-gradient(155deg,#d4dde6,#cad4cd,#c0cbc4)] dark:border-white/12 dark:bg-[radial-gradient(circle_at_14%_16%,rgba(134,239,172,0.06),transparent_32%),linear-gradient(155deg,#08120f,#0d1b15,#111827)] rounded-[0.85rem] px-3 py-2 ${isFullWidth ? "sm:col-span-2" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[0.72rem] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <span className="rounded-full border border-slate-500/35 bg-slate-500/8 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-slate-600 dark:border-white/12 dark:bg-white/4 dark:text-slate-300">
          {section}
        </span>
      </div>
      <p className="mt-2.5 font-['Space_Grotesk'] text-[1.16rem] font-semibold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

export function KeyInfoPanel({
  lastUpdatedLabel,
  overviewMetrics,
  performanceMetrics,
  activityMetrics,
}: Props) {
  const detailMetrics = [
    ...performanceMetrics.map((metric) => ({
      ...metric,
      section: "Performance",
    })),
    ...activityMetrics.map((metric) => ({ ...metric, section: "Activity" })),
  ];

  return (
    <>
      <div className="mb-2.5 flex items-center gap-2">
        <p className="font-['Space_Grotesk'] text-[1.08rem] font-semibold text-slate-900 dark:text-white">
          Key Info
        </p>
        <span
          className="h-1 w-1 rounded-full bg-emerald-400/60"
          aria-hidden="true"
        />
        <p className="text-[0.76rem] text-slate-500 dark:text-slate-400">
          live snapshot
        </p>
        <span
          className="h-1 w-1 rounded-full bg-slate-400/40"
          aria-hidden="true"
        />
        <p className="text-[0.76rem] text-slate-500 dark:text-slate-400">
          {lastUpdatedLabel}
        </p>
      </div>

      <div className="grid gap-2">
        <div className="grid gap-2 md:grid-cols-2">
          {overviewMetrics.slice(0, 2).map((metric) => (
            <MetricTile key={metric.label} metric={metric} />
          ))}
        </div>

        <div className="grid gap-2 md:grid-cols-[minmax(0,5fr)_minmax(0,3fr)]">
          {overviewMetrics.slice(2).map((metric) => (
            <MetricTile key={metric.label} metric={metric} />
          ))}
        </div>
      </div>

      <div className="mt-7 grid gap-1.5 sm:grid-cols-2">
        {detailMetrics.map((metric, index) => (
          <DetailMetricTile
            key={`${metric.section}-${metric.label}`}
            {...metric}
            isFullWidth={
              detailMetrics.length % 2 === 1 &&
              index === detailMetrics.length - 1
            }
          />
        ))}
      </div>
    </>
  );
}
