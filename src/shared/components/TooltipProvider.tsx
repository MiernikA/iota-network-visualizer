import type { PropsWithChildren } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import { TooltipContext, type TooltipController } from "./tooltipContext";

type TooltipSnapshot = {
  ownerId: string;
  content: string;
  className?: string;
};

export function TooltipProvider({ children }: PropsWithChildren) {
  const [active, setActive] = useState<TooltipSnapshot | null>(null);
  const activeOwnerRef = useRef<string | null>(null);

  const show = useCallback(
    (ownerId: string, content: string, className?: string) => {
      activeOwnerRef.current = ownerId;
      setActive({ ownerId, content, className });
    },
    [],
  );

  const hide = useCallback((ownerId: string) => {
    if (activeOwnerRef.current !== ownerId) {
      return;
    }

    activeOwnerRef.current = null;
    setActive(null);
  }, []);

  const controller = useMemo<TooltipController>(() => ({ show, hide }), [show, hide]);

  return (
    <TooltipContext.Provider value={controller}>
      {children}
      <div className="pointer-events-none fixed left-0 right-0 top-2 z-[9999] flex justify-center px-3">
        {active ? (
          <div
            role="tooltip"
            aria-live="polite"
            className={`max-w-[min(48rem,calc(100vw-1.5rem))] rounded-md border border-emerald-200/18 bg-slate-950/94 px-3 py-2 text-center text-[0.72rem] leading-snug text-slate-100 shadow-[0_14px_34px_rgba(2,6,23,0.42)] ring-1 ring-white/6 backdrop-blur-md ${active.className ?? ""}`}
          >
            {active.content}
          </div>
        ) : null}
      </div>
    </TooltipContext.Provider>
  );
}
