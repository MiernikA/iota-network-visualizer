import { useMemo } from "react";
import type { DashboardSnapshot } from "../../../types/dashboard/DashboardSnapshot";
import type { OverviewMetric, DetailMetric } from "../../../types/globe/panel";
import { formatCompact, formatIota } from "../../../shared/utils/formatters";
import { formatDuration } from "./utils/home.utils";

type ActivityMetric = {
  label: string;
  value: string;
};

function formatAccentTooltip(
  label: string,
  accent: number | null,
  description: string,
) {
  if (accent === null || !Number.isFinite(accent)) {
    return `${label}: no comparison available. ${description}`;
  }

  return `${label}: ${accent >= 0 ? "+" : ""}${accent.toFixed(1)}%. ${description}`;
}

function formatRollingTransactions(value: number) {
  if (!Number.isFinite(value)) {
    return "-";
  }

  return new Intl.NumberFormat("en-US").format(value);
}

function formatOverviewIota(value: number) {
  const valueInIota = value / 1_000_000_000;

  if (Math.abs(valueInIota) >= 1_000_000) {
    return `${valueInIota >= 0 ? "" : "-"}${formatCompact(Math.abs(valueInIota), 2)} IOTA`;
  }

  return `${formatIota(value)} IOTA`;
}

function buildActivityMetrics(snapshot: DashboardSnapshot): ActivityMetric[] {
  return [
    {
      label: "Transactions (last checkpoint)",
      value: String(snapshot.latestCheckpointTransactionsCount),
    },
    {
      label: `Avg Tx / checkpoint (last ${snapshot.transactionsPerCheckpointSampleSize})`,
      value: snapshot.averageTransactionsPerCheckpoint.toFixed(2),
    },
    {
      label: "Latest Checkpoint #",
      value: snapshot.recentCheckpoints[0]
        ? new Intl.NumberFormat("en-US").format(
            snapshot.recentCheckpoints[0].sequenceNumber,
          )
        : "-",
    },
  ];
}

function buildPerformanceMetrics(snapshot: DashboardSnapshot): DetailMetric[] {
  return [
    { label: "TPS", value: snapshot.networkTps.toFixed(2) },
    {
      label: `Avg Checkpoint Interval (last ${snapshot.transactionsPerCheckpointSampleSize})`,
      value: formatDuration(snapshot.checkpointIntervalMs),
    },
  ];
}

function buildOverviewMetrics(snapshot: DashboardSnapshot): OverviewMetric[] {
  const previousEpoch = snapshot.epochHistory.at(-2) ?? null;
  const stakeDelta =
    previousEpoch && previousEpoch.totalStake > 0
      ? ((snapshot.staking.totalStaked - previousEpoch.totalStake) /
          previousEpoch.totalStake) *
        100
      : null;
  const validatorDelta =
    previousEpoch && previousEpoch.validatorCount > 0
      ? ((snapshot.epoch.validatorCount - previousEpoch.validatorCount) /
          previousEpoch.validatorCount) *
        100
      : null;
  const finalityAccent =
    snapshot.recentFinalityMs > 0
      ? -Math.min((snapshot.recentFinalityMs / 5000) * 100, 100)
      : null;

  return [
    {
      label: "Total Stake",
      value: formatOverviewIota(snapshot.staking.totalStaked),
      accent: stakeDelta,
      accentTooltip: formatAccentTooltip(
        "Total Stake",
        stakeDelta,
        "Compared with the previous epoch total stake.",
      ),
    },
    {
      label: "Observed Transactions",
      value: formatRollingTransactions(snapshot.rollingTotalTransactions),
      accent: null,
      accentTooltip: formatAccentTooltip(
        "Observed Transactions",
        null,
        "Lifetime network transaction total from the latest checkpoint RPC snapshot.",
      ),
    },
    {
      label: "Checkpoint Interval (recent)",
      value: formatDuration(snapshot.recentFinalityMs),
      accent: finalityAccent,
      accentTooltip: formatAccentTooltip(
        "Checkpoint Interval",
        finalityAccent,
        "This is derived from checkpoint timestamps (time between consecutive checkpoints), not transaction finality.",
      ),
    },
    {
      label: "Validators",
      value: String(snapshot.epoch.validatorCount),
      accent: validatorDelta,
      accentTooltip: formatAccentTooltip(
        "Validators",
        validatorDelta,
        "Compared with the validator count in the previous epoch.",
      ),
    },
  ];
}

export function useHomeViewModel(snapshot: DashboardSnapshot) {
  return useMemo(
    () => ({
      overviewMetrics: buildOverviewMetrics(snapshot),
      performanceMetrics: buildPerformanceMetrics(snapshot),
      activityMetrics: buildActivityMetrics(snapshot),
    }),
    [snapshot],
  );
}
