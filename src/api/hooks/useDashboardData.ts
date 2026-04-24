import { useCallback } from "react";
import { fetchDashboardSnapshot } from "../dashboard.service";
import { useAsyncValue, type LoadState } from "./useAsyncValue";
import type { DashboardSnapshot } from "../../types/dashboard/DashboardSnapshot";

export function useDashboardData(intervalMs = 8_000): LoadState<DashboardSnapshot> {
  const loader = useCallback(() => fetchDashboardSnapshot(), []);
  return useAsyncValue(loader, { pollIntervalMs: intervalMs });
}
