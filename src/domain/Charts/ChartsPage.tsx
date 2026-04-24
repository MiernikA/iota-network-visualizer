import type { DashboardSnapshot } from "../../types/dashboard/DashboardSnapshot";
import { useChartsViewModel } from "./data/useChartsViewModel";
import { ChartCoverageCard } from "./components/ChartCoverageCard";
import { ChartsGrid } from "./components/ChartsGrid";
import { ChartSummaryCards } from "./components/ChartSummaryCards";

type Props = {
  snapshot: DashboardSnapshot;
};

export function ChartsPage({ snapshot }: Props) {
  const viewModel = useChartsViewModel(snapshot);

  return (
    <div className="space-y-6">
      <ChartCoverageCard
        transactionsWindowMs={viewModel.coverage.transactionsWindowMs}
        transactionsCount={viewModel.coverage.transactionsCount}
        finalityWindowMs={viewModel.coverage.finalityWindowMs}
        finalityCount={viewModel.coverage.finalityCount}
        epochWindowMs={viewModel.coverage.epochWindowMs}
        epochCount={viewModel.coverage.epochCount}
      />

      <ChartSummaryCards cards={viewModel.summaryCards} />

      <ChartsGrid
        snapshot={snapshot}
        activityData={viewModel.activityData}
        throughputData={viewModel.throughputData}
        finalityData={viewModel.finalityData}
        stakeDistributionData={viewModel.stakeDistributionData}
        apyRewardsData={viewModel.apyRewardsData}
        feesData={viewModel.feesData}
      />
    </div>
  );
}
