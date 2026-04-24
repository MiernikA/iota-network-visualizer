import type { ValidatorSnapshot } from "../validators/ValidatorSnapshot";

export type OverviewMetric = {
  label: string;
  value: string;
  accent: number | null;
  accentTooltip?: string;
};

export type DetailMetric = {
  label: string;
  value: string;
};

export type GlobePanelProps = {
  validators: ValidatorSnapshot[];
  updatedAt: number | null;
  overviewMetrics: OverviewMetric[];
  performanceMetrics: DetailMetric[];
  activityMetrics: Array<{
    label: string;
    value: string;
  }>;
};
