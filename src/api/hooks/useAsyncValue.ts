import { useCallback, useEffect, useRef, useState } from "react";

export type LoadState<T> = {
  data: T | null;
  isLoading: boolean;
  error: string;
  updatedAt: number | null;
};

type Options = {
  pollIntervalMs?: number;
};

function withJitter(valueMs: number, jitterRatio = 0.2): number {
  const jitter = valueMs * jitterRatio;
  const min = Math.max(0, valueMs - jitter);
  const max = valueMs + jitter;
  return Math.floor(min + Math.random() * (max - min));
}

function computeBackoffMs(
  baseMs: number,
  attempt: number,
  maxMs = 60_000,
): number {
  const clampedAttempt = Math.max(0, Math.min(attempt, 8));
  const factor = 2 ** clampedAttempt;
  return Math.min(Math.max(baseMs, 250), maxMs / 2) * factor;
}

export function useAsyncValue<T>(
  loader: () => Promise<T>,
  options: Options = {},
): LoadState<T> {
  const { pollIntervalMs } = options;
  const [state, setState] = useState<LoadState<T>>({
    data: null,
    isLoading: true,
    error: "",
    updatedAt: null,
  });

  const cancelledRef = useRef(false);
  const inFlightRef = useRef<Promise<void> | null>(null);
  const failureCountRef = useRef(0);
  const nextTimerRef = useRef<number | null>(null);
  const runOnceRef = useRef<(() => void) | null>(null);

  const scheduleNext = useCallback(
    (delayMs: number) => {
      if (!pollIntervalMs) return;

      if (nextTimerRef.current !== null) {
        window.clearTimeout(nextTimerRef.current);
        nextTimerRef.current = null;
      }

      nextTimerRef.current = window.setTimeout(() => {
        runOnceRef.current?.();
      }, delayMs);
    },
    [pollIntervalMs],
  );

  const runOnce = useCallback(async () => {
    if (inFlightRef.current) return;

    setState((prev) => (prev.data ? prev : { ...prev, isLoading: true }));

    const task = (async () => {
      try {
        const data = await loader();
        if (cancelledRef.current) return;

        failureCountRef.current = 0;
        setState({
          data,
          isLoading: false,
          error: "",
          updatedAt: Date.now(),
        });

        if (pollIntervalMs) {
          scheduleNext(withJitter(pollIntervalMs));
        }
      } catch (error) {
        if (cancelledRef.current) return;

        failureCountRef.current += 1;
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }));

        if (pollIntervalMs) {
          const backoff = computeBackoffMs(pollIntervalMs, failureCountRef.current);
          scheduleNext(withJitter(backoff));
        }
      }
    })();

    inFlightRef.current = task;
    await task.finally(() => {
      inFlightRef.current = null;
    });
  }, [loader, pollIntervalMs, scheduleNext]);

  useEffect(() => {
    runOnceRef.current = () => {
      void runOnce();
    };
  }, [runOnce]);

  useEffect(() => {
    cancelledRef.current = false;
    void runOnce();

    return () => {
      cancelledRef.current = true;
    };
  }, [runOnce]);

  useEffect(() => {
    if (!pollIntervalMs) return;

    return () => {
      if (nextTimerRef.current !== null) {
        window.clearTimeout(nextTimerRef.current);
        nextTimerRef.current = null;
      }
    };
  }, [pollIntervalMs]);

  return state;
}
