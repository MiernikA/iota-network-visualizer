import type { CheckpointItem } from "../../types/iota/CheckpointItem";
import type { CheckpointPage } from "../../types/iota/CheckpointPage";
import type { EpochPage } from "../../types/iota/EpochPage";
import type { LatestSystemStateResult } from "../../types/iota/LatestSystemStateResult";
import type { ValidatorsApyResult } from "../../types/iota/ValidatorsApyResult";
import { callJsonRpc } from "./data.rpc";

type DashboardSources = {
  systemStateResult: LatestSystemStateResult;
  apyResult: ValidatorsApyResult;
  checkpoints: CheckpointPage;
  epochs: EpochPage;
};

type CacheState<T> = {
  value: T | null;
  fetchedAtMs: number;
  inFlight: Promise<T> | null;
};

const DEFAULT_CHECKPOINT_LIMIT = 300;
const DEFAULT_EPOCH_LIMIT = 90;
const DEFAULT_CHECKPOINTS_TTL_MS = 30_000;
const DEFAULT_EPOCHS_TTL_MS = 5 * 60_000;
const DEFAULT_RPC_TIMEOUT_MS = 12_000;
const DEFAULT_SYSTEM_STATE_TTL_MS = 8_000;
const DEFAULT_APY_TTL_MS = 60_000;

const checkpointsCache: CacheState<CheckpointPage> = {
  value: null,
  fetchedAtMs: 0,
  inFlight: null,
};

const epochsCache: CacheState<EpochPage> = {
  value: null,
  fetchedAtMs: 0,
  inFlight: null,
};

const systemStateCache: CacheState<LatestSystemStateResult> = {
  value: null,
  fetchedAtMs: 0,
  inFlight: null,
};

const apyCache: CacheState<ValidatorsApyResult> = {
  value: null,
  fetchedAtMs: 0,
  inFlight: null,
};

export async function fetchDashboardSources(): Promise<DashboardSources> {
  const checkpointLimit = DEFAULT_CHECKPOINT_LIMIT;
  const epochLimit = DEFAULT_EPOCH_LIMIT;
  const checkpointsTtlMs = DEFAULT_CHECKPOINTS_TTL_MS;
  const epochsTtlMs = DEFAULT_EPOCHS_TTL_MS;
  const rpcTimeoutMs = DEFAULT_RPC_TIMEOUT_MS;

  const getLatestSystemState = () =>
    callJsonRpc<LatestSystemStateResult>("iotax_getLatestIotaSystemStateV2", [], {
      timeoutMs: rpcTimeoutMs,
    });

  const getValidatorsApy = () =>
    callJsonRpc<ValidatorsApyResult>("iotax_getValidatorsApy", [], {
      timeoutMs: rpcTimeoutMs,
    });

  const getRecentEpochs = (limit = 8) =>
    callJsonRpc<EpochPage>("iotax_getEpochs", [null, limit, true], {
      timeoutMs: rpcTimeoutMs,
    });

  const getRecentCheckpoints = async (limit = 300): Promise<CheckpointPage> => {
    const pageSize = 100;
    const items: CheckpointItem[] = [];
    let cursor: string | null = null;
    let hasNextPage = true;

    while (items.length < limit && hasNextPage) {
      const page: CheckpointPage = await callJsonRpc<CheckpointPage>(
        "iota_getCheckpoints",
        [cursor, Math.min(pageSize, limit - items.length), true],
        { timeoutMs: rpcTimeoutMs },
      );

      items.push(...page.data);
      cursor = page.nextCursor;
      hasNextPage = page.hasNextPage;
    }

    return { data: items, hasNextPage, nextCursor: cursor };
  };

  const now = Date.now();

  const systemStateTtlMs = DEFAULT_SYSTEM_STATE_TTL_MS;
  const apyTtlMs = DEFAULT_APY_TTL_MS;

  const shouldRefreshCheckpoints =
    !checkpointsCache.value ||
    now - checkpointsCache.fetchedAtMs >= checkpointsTtlMs;

  const shouldRefreshEpochs =
    !epochsCache.value ||
    now - epochsCache.fetchedAtMs >= epochsTtlMs;

  const shouldRefreshSystemState =
    !systemStateCache.value ||
    now - systemStateCache.fetchedAtMs >= systemStateTtlMs;

  const shouldRefreshApy =
    !apyCache.value || now - apyCache.fetchedAtMs >= apyTtlMs;

  const systemStatePromise =
    shouldRefreshSystemState
      ? (systemStateCache.inFlight ??=
          getLatestSystemState()
            .then((res) => {
              systemStateCache.value = res;
              systemStateCache.fetchedAtMs = Date.now();
              return res;
            })
            .finally(() => (systemStateCache.inFlight = null)))
      : Promise.resolve(systemStateCache.value!);

  const apyPromise =
    shouldRefreshApy
      ? (apyCache.inFlight ??=
          getValidatorsApy()
            .then((res) => {
              apyCache.value = res;
              apyCache.fetchedAtMs = Date.now();
              return res;
            })
            .finally(() => (apyCache.inFlight = null)))
      : Promise.resolve(apyCache.value!);

  const checkpointsPromise =
    shouldRefreshCheckpoints
      ? (checkpointsCache.inFlight ??=
          getRecentCheckpoints(checkpointLimit)
            .then((res) => {
              checkpointsCache.value = res;
              checkpointsCache.fetchedAtMs = Date.now();
              return res;
            })
            .finally(() => (checkpointsCache.inFlight = null)))
      : Promise.resolve(checkpointsCache.value!);

  const epochsPromise =
    shouldRefreshEpochs
      ? (epochsCache.inFlight ??=
          getRecentEpochs(epochLimit)
            .then((res) => {
              epochsCache.value = res;
              epochsCache.fetchedAtMs = Date.now();
              return res;
            })
            .finally(() => (epochsCache.inFlight = null)))
      : Promise.resolve(epochsCache.value!);

  const [systemStateResult, apyResult, checkpoints, epochs] = await Promise.all([
    systemStatePromise,
    apyPromise,
    checkpointsPromise,
    epochsPromise,
  ]);

  return { systemStateResult, apyResult, checkpoints, epochs };
}
