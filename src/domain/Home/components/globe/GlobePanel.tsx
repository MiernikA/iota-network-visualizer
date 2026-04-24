import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { KeyInfoPanel } from "../KeyInfoPanel";
import type { GlobePanelProps } from "../../../../types/globe/panel";

const GlobeSceneLazy = lazy(() =>
  import("./GlobeScene").then((module) => ({ default: module.GlobeScene })),
);

export function GlobePanel({
  validators,
  updatedAt,
  overviewMetrics,
  performanceMetrics,
  activityMetrics,
}: GlobePanelProps) {
  const keyInfoRef = useRef<HTMLDivElement | null>(null);
  const [panelHeight, setPanelHeight] = useState(360);
  const [now, setNow] = useState(() => Date.now());

  const lastUpdatedLabel =
    updatedAt === null
      ? "Last updated: --"
      : `Last updated: ${Math.max(Math.floor((now - updatedAt) / 1000), 0)} sec ago`;

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!keyInfoRef.current) {
      return;
    }

    const updateHeight = () => {
      if (!keyInfoRef.current) {
        return;
      }

      setPanelHeight(Math.max(360, Math.ceil(keyInfoRef.current.offsetHeight)));
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(keyInfoRef.current);

    return () => observer.disconnect();
  }, [overviewMetrics, performanceMetrics, activityMetrics]);

  return (
    <div className="relative overflow-hidden">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:items-stretch">
        <Suspense
          fallback={
            <div
              className="relative overflow-hidden rounded-[1.2rem] border border-slate-500/50 bg-[linear-gradient(160deg,#d2dbe4,#c7d1ca_48%,#bcc7c0)] shadow-[0_20px_70px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-[radial-gradient(circle_at_12%_12%,rgba(134,239,172,0.08),transparent_30%),linear-gradient(160deg,#020617,#0c1f18_52%,#0f172a)]"
              style={{ height: `${panelHeight}px` }}
            >
              <div className="absolute inset-0 grid place-items-center text-xs font-medium tracking-[0.16em] text-slate-600/80 dark:text-slate-300/80">
                Loading globe…
              </div>
            </div>
          }
        >
          <GlobeSceneLazy validators={validators} height={panelHeight} />
        </Suspense>

        <div
          ref={keyInfoRef}
          className="border border-slate-500/70 bg-[linear-gradient(160deg,#d2dbe4,#c7d1ca_48%,#bcc7c0)] shadow-[0_20px_70px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-[radial-gradient(circle_at_12%_12%,rgba(134,239,172,0.08),transparent_30%),linear-gradient(160deg,#020617,#0c1f18_52%,#0f172a)] dark:shadow-[0_20px_70px_rgba(2,6,23,0.35)] rounded-[1.2rem] p-3 sm:p-3.5"
        >
          <KeyInfoPanel
            lastUpdatedLabel={lastUpdatedLabel}
            overviewMetrics={overviewMetrics}
            performanceMetrics={performanceMetrics}
            activityMetrics={activityMetrics}
          />
        </div>
      </div>
    </div>
  );
}
