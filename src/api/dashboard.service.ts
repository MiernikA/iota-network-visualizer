import type { DashboardSnapshot } from "../types/dashboard/DashboardSnapshot";
import { fetchDashboardSources } from "./source/data.fetch";
import { buildDashboardSnapshot } from "./source/data.map";

type DashboardSources = Awaited<ReturnType<typeof fetchDashboardSources>>;

let lastSources: DashboardSources | null = null;
let lastSnapshot: DashboardSnapshot | null = null;

export async function fetchDashboardSnapshot(): Promise<DashboardSnapshot> {
  const sources = await fetchDashboardSources();

  if (
    lastSources &&
    lastSnapshot &&
    sources.systemStateResult === lastSources.systemStateResult &&
    sources.apyResult === lastSources.apyResult &&
    sources.checkpoints === lastSources.checkpoints &&
    sources.epochs === lastSources.epochs
  ) {
    return lastSnapshot;
  }

  const snapshot = buildDashboardSnapshot({
    systemStateResult: sources.systemStateResult,
    apyResult: sources.apyResult,
    checkpoints: sources.checkpoints.data,
    epochs: sources.epochs.data,
  });

  lastSources = sources;
  lastSnapshot = snapshot;

  return snapshot;
}
