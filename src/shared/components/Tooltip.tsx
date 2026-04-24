import type { PropsWithChildren } from "react";
import { useContext, useId } from "react";
import { TooltipContext } from "./tooltipContext";

type Props = PropsWithChildren<{
  content?: string
  className?: string
  tooltipClassName?: string
}>

export function Tooltip({
  content,
  className = '',
  tooltipClassName = '',
  children,
}: Props) {
  const controller = useContext(TooltipContext);
  const ownerId = useId();

  if (!content) {
    return <>{children}</>;
  }

  if (!controller) {
    return (
      <span className={`group/tooltip relative inline-flex ${className}`}>
        {children}
        <span
          role="tooltip"
          className={`pointer-events-none absolute bottom-full left-1/2 z-40 mb-2 w-max max-w-64 -translate-x-1/2 rounded-md border border-emerald-200/18 bg-slate-950/94 px-2.5 py-1.5 text-center text-[0.72rem] leading-snug text-slate-100 opacity-0 shadow-[0_14px_34px_rgba(2,6,23,0.42)] ring-1 ring-white/6 backdrop-blur-md transition duration-150 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100 ${tooltipClassName}`}
        >
          {content}
        </span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex ${className}`}
      onMouseEnter={() => controller.show(ownerId, content, tooltipClassName)}
      onMouseLeave={() => controller.hide(ownerId)}
      onFocus={() => controller.show(ownerId, content, tooltipClassName)}
      onBlur={() => controller.hide(ownerId)}
      onTouchStart={() => controller.show(ownerId, content, tooltipClassName)}
      onTouchEnd={() => controller.hide(ownerId)}
    >
      {children}
    </span>
  );
}
