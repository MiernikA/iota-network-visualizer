import type { RpcEnvelope } from "../../types/iota/RpcEnvelope";

const ALLOWED_METHODS = [
  "iota_getCheckpoints",
  "iotax_getLatestIotaSystemStateV2",
  "iotax_getValidatorsApy",
  "iotax_getEpochs",
];

function resolveRpcUrl(method: string): string {
  const rpcUrl = import.meta.env.VITE_IOTA_RPC_URL;
  const indexerUrl = import.meta.env.VITE_IOTA_INDEXER_URL;

  if (!rpcUrl) {
    throw new Error("Missing VITE_IOTA_RPC_URL env var");
  }
  if (!indexerUrl) {
    throw new Error("Missing VITE_IOTA_INDEXER_URL env var");
  }

  if (method === "iotax_getEpochs") {
    return indexerUrl;
  }
  return rpcUrl;
}

function toFiniteInt(value: unknown, fallback: number): number {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.floor(numeric);
}

function ensureValidParams(method: string, params: unknown[]): unknown[] {
  switch (method) {
    case "iotax_getLatestIotaSystemStateV2":
    case "iotax_getValidatorsApy": {
      if (params.length > 0) {
        throw new Error(`RPC ${method} does not accept params`);
      }
      return [];
    }
    case "iotax_getEpochs": {
      const cursor = params[0] ?? null;
      const limitRaw = params[1] ?? 90;
      const descendingRaw = params[2] ?? true;

      const safeCursor =
        cursor === null || typeof cursor === "string" ? cursor : null;
      const limit = Math.max(
        1,
        Math.min(
          250,
          toFiniteInt(limitRaw, 90),
        ),
      );
      const descending = Boolean(descendingRaw);

      return [safeCursor, limit, descending];
    }
    case "iota_getCheckpoints": {
      const cursor = params[0] ?? null;
      const limitRaw = params[1] ?? 100;
      const descendingRaw = params[2] ?? true;

      const safeCursor =
        cursor === null || typeof cursor === "string" ? cursor : null;
      const limit = Math.max(
        1,
        Math.min(
          100,
          toFiniteInt(limitRaw, 100),
        ),
      );
      const descending = Boolean(descendingRaw);

      return [safeCursor, limit, descending];
    }
    default:
      return params;
  }
}

export async function callJsonRpc<T>(
  method: string,
  params: unknown[] = [],
  options: { timeoutMs?: number; signal?: AbortSignal } = {},
): Promise<T> {
  if (!ALLOWED_METHODS.includes(method)) {
    throw new Error(`RPC method not allowed: ${method}`);
  }

  const safeParams = ensureValidParams(method, params);
  const { timeoutMs = 12_000, signal } = options;
  const controller = new AbortController();

  let timeoutId: number | null = null;
  if (timeoutMs > 0) {
    timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  }

  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  let response: Response;

  try {
    response = await fetch(resolveRpcUrl(method), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params: safeParams }),
      signal: controller.signal,
    });
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(`RPC ${method} failed: Request timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error(`RPC ${method} failed: HTTP ${response.status}`);
  }

  const payload = (await response.json()) as RpcEnvelope<T>;

  if (payload.error) {
    throw new Error(`RPC ${method} failed: ${payload.error.message}`);
  }

  if (payload.result === undefined) {
    throw new Error(`RPC ${method} failed: Missing result`);
  }

  return payload.result;
}
