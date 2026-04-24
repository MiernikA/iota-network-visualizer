import { useMemo } from "react";
import { formatCompact, formatPercent } from "../../../shared/utils/formatters";
import type { DashboardSnapshot } from "../../../types/dashboard/DashboardSnapshot";
import { chartTheme } from "./utils/chartConfig/chartTheme";
import { computeMedian, formatFeeValue, movingAverage } from "./utils/charts.utils";

export function useChartsViewModel(snapshot: DashboardSnapshot) {
  return useMemo(() => {
    const transactionsSource = snapshot.transactionBuckets;
    const epochSource = snapshot.epochHistory;
    const finalitySource = snapshot.finalitySeries;
    const latestFeePoint = epochSource[epochSource.length - 1] ?? null;

    const transactionsWindowMs =
      transactionsSource.length > 1
        ? transactionsSource[transactionsSource.length - 1].timestampMs -
          transactionsSource[0].timestampMs
        : 0;
    const finalityWindowMs =
      finalitySource.length > 1
        ? finalitySource[finalitySource.length - 1].timestampMs -
          finalitySource[0].timestampMs
        : 0;
    const epochWindowMs =
      epochSource.length > 1
        ? epochSource[epochSource.length - 1].timestampMs -
          epochSource[0].timestampMs
        : 0;

    const tpsSeries = transactionsSource.map((bucket) => bucket.txCount / 5);
    const observedTransactionsSeries = transactionsSource.map(
      (bucket) => bucket.txCount,
    );
    const observedTransactionsMovingAverage = movingAverage(
      observedTransactionsSeries,
      12,
    );
    const throughputMovingAverage = movingAverage(tpsSeries, 12);
    const finalityMovingAverage = movingAverage(
      finalitySource.map((point) => point.finalityMs),
      8,
    );
    const medianApy = computeMedian(
      snapshot.validators.map((validator) => validator.apy * 100),
    );

    const topValidators = [...snapshot.validators]
      .sort((left, right) => right.stake - left.stake)
      .slice(0, 10);

    return {
      coverage: {
        transactionsWindowMs,
        transactionsCount: transactionsSource.length,
        finalityWindowMs,
        finalityCount: finalitySource.length,
        epochWindowMs,
        epochCount: epochSource.length,
      },
      summaryCards: [
        {
          label: "TPS (checkpoint window)",
          value: formatCompact(tpsSeries[tpsSeries.length - 1] ?? 0, 2),
        },
        {
          label: "Checkpoint Interval",
          value: `${(finalitySource[finalitySource.length - 1]?.finalityMs ?? 0).toFixed(0)} ms`,
        },
        {
          label: "Validator APY (snapshot)",
          value: formatPercent(medianApy, 2),
        },
        {
          label: "Latest Fees / TX",
          value: formatFeeValue(latestFeePoint?.avgFeePerTx ?? 0),
        },
      ],
      activityData: {
        labels: transactionsSource.map((bucket) => bucket.label),
        datasets: [
          {
            label: "Observed Transactions",
            data: observedTransactionsSeries,
            borderColor: chartTheme.primary.line,
            backgroundColor: chartTheme.primary.fill,
            pointBackgroundColor: chartTheme.primary.point,
            pointBorderColor: chartTheme.primary.pointBorder,
            pointHoverBackgroundColor: "#ffffff",
            pointRadius: 3,
            pointHoverRadius: 4.5,
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
          },
          {
            label: "Observed Transactions (moving average)",
            data: observedTransactionsMovingAverage,
            borderColor: chartTheme.accent.line,
            backgroundColor: chartTheme.accent.fill,
            pointBackgroundColor: chartTheme.accent.point,
            pointBorderColor: chartTheme.accent.pointBorder,
            pointRadius: 2.5,
            pointHoverRadius: 4,
            borderWidth: 2.25,
            fill: false,
            tension: 0.3,
          },
        ],
      },
      throughputData: {
        labels: transactionsSource.map((bucket) => bucket.label),
        datasets: [
          {
            label: "TPS (checkpoint window)",
            data: tpsSeries,
            borderColor: chartTheme.secondary.line,
            backgroundColor: chartTheme.secondary.fill,
            pointBackgroundColor: chartTheme.secondary.point,
            pointBorderColor: chartTheme.secondary.pointBorder,
            pointRadius: 3,
            pointHoverRadius: 4.5,
            borderWidth: 2.5,
            fill: true,
            tension: 0.28,
          },
          {
            label: "Moving average",
            data: throughputMovingAverage,
            borderColor: chartTheme.accentStrong.line,
            backgroundColor: chartTheme.accentStrong.fill,
            pointBackgroundColor: chartTheme.accentStrong.point,
            pointBorderColor: chartTheme.accentStrong.pointBorder,
            pointRadius: 2.5,
            pointHoverRadius: 4,
            borderWidth: 2.25,
            fill: false,
            tension: 0.28,
          },
        ],
      },
      finalityData: {
        labels: finalitySource.map((point) => point.label),
        datasets: [
          {
            label: "Checkpoint Interval (ms)",
            data: finalitySource.map((point) => point.finalityMs),
            borderColor: chartTheme.accent.line,
            backgroundColor: chartTheme.accent.fill,
            pointBackgroundColor: chartTheme.accent.point,
            pointBorderColor: chartTheme.accent.pointBorder,
            pointRadius: 3,
            pointHoverRadius: 4.5,
            borderWidth: 2.5,
            fill: true,
            tension: 0.25,
          },
          {
            label: "Moving average",
            data: finalityMovingAverage,
            borderColor: chartTheme.primary.line,
            backgroundColor: chartTheme.primary.fill,
            pointBackgroundColor: chartTheme.primary.point,
            pointBorderColor: chartTheme.primary.pointBorder,
            pointRadius: 2.5,
            pointHoverRadius: 4,
            borderWidth: 2.25,
            fill: false,
            tension: 0.25,
          },
        ],
      },
      stakeDistributionData: {
        labels: topValidators.map((validator) => validator.name),
        datasets: [
          {
            data: topValidators.map(
              (validator) =>
                (validator.stake / snapshot.staking.totalStaked) * 100,
            ),
            backgroundColor: chartTheme.palette,
            borderColor: "#04110b",
            borderWidth: 2,
          },
        ],
      },
      apyRewardsData: {
        labels: topValidators.slice(0, 8).map((validator) => validator.name),
        datasets: [
          {
            label: "APY %",
            data: topValidators
              .slice(0, 8)
              .map((validator) => validator.apy * 100),
            backgroundColor: chartTheme.palette
              .slice(0, 8)
              .map((color: string) => `${color}dd`),
            borderColor: "#020617",
            borderWidth: 1.5,
            borderRadius: 10,
          },
        ],
      },
      feesData: {
        labels: epochSource.map((epoch) => epoch.label),
        datasets: [
          {
            label: "Avg fee / tx (IOTA)",
            data: epochSource.map((epoch) => epoch.avgFeePerTx / 1_000_000_000),
            borderColor: chartTheme.accentStrong.line,
            backgroundColor: chartTheme.accentStrong.fill,
            pointBackgroundColor: chartTheme.accentStrong.point,
            pointBorderColor: chartTheme.accentStrong.pointBorder,
            pointRadius: 3,
            pointHoverRadius: 4.5,
            borderWidth: 2.5,
            fill: true,
            tension: 0.3,
          },
        ],
      },
    };
  }, [snapshot]);
}
