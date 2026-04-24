import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  type ChartData,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { SurfaceCard } from "../../../shared/components/SurfaceCard";
import { formatPercent } from "../../../shared/utils/formatters";
import type { DashboardSnapshot } from "../../../types/dashboard/DashboardSnapshot";
import { getChartOptions } from "../data/utils/chartConfig/getChartOptions";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
);

type Props = {
  snapshot: DashboardSnapshot;
  activityData: ChartData<"line", number[], string>;
  throughputData: ChartData<"line", number[], string>;
  finalityData: ChartData<"line", number[], string>;
  stakeDistributionData: ChartData<"doughnut", number[], string>;
  apyRewardsData: ChartData<"bar", number[], string>;
  feesData: ChartData<"line", number[], string>;
};

export function ChartsGrid({
  snapshot,
  activityData,
  throughputData,
  finalityData,
  stakeDistributionData,
  apyRewardsData,
  feesData,
}: Props) {
  const chartOptions = getChartOptions();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <SurfaceCard
        title="Observed Transactions"
        subtitle="Observed transactions per checkpoint bucket from the loaded checkpoint window."
      >
        <div className="h-80">
          <Line data={activityData} options={chartOptions} />
        </div>
      </SurfaceCard>

      <SurfaceCard
        title="TPS (checkpoint window)"
        subtitle="Checkpoint-window TPS and moving average from the loaded checkpoint window."
      >
        <div className="h-80">
          <Line data={throughputData} options={chartOptions} />
        </div>
      </SurfaceCard>

      <SurfaceCard
        title="Checkpoint Interval"
        subtitle="Time between consecutive checkpoints (derived from timestamps) and moving average."
      >
        <div className="h-80">
          <Line data={finalityData} options={chartOptions} />
        </div>
      </SurfaceCard>

      <SurfaceCard
        title="Stake Distribution"
        subtitle={`Top validators hold ${formatPercent(snapshot.validatorDistribution)} of network stake.`}
      >
        <div className="h-80">
          <Doughnut
            data={stakeDistributionData}
            options={{ ...chartOptions, cutout: "58%" }}
          />
        </div>
      </SurfaceCard>

      <SurfaceCard
        title="Validator APY (snapshot)"
        subtitle="Current validator APY snapshot from the RPC APY endpoint."
      >
        <div className="h-80">
          <Bar data={apyRewardsData} options={chartOptions} />
        </div>
      </SurfaceCard>

      <SurfaceCard
        title="Fees"
        subtitle="Average transaction fees across the loaded epoch history."
      >
        <div className="h-80">
          <Line data={feesData} options={chartOptions} />
        </div>
      </SurfaceCard>
    </div>
  );
}
