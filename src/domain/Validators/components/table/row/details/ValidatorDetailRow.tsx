import type { ReactNode } from "react";
import { Tooltip } from "../../../../../../shared/components/Tooltip";

type Props = {
  label: string;
  value: ReactNode;
  valueClassName?: string;
  breakValue?: boolean;
  title?: string;
  columnSpanClassName?: string;
};

export function ValidatorDetailRow({
  label,
  value,
  valueClassName = "text-slate-700 dark:text-slate-300",
  breakValue = false,
  title,
  columnSpanClassName,
}: Props) {
  return (
    <div
      className={`${columnSpanClassName ?? ""} grid grid-cols-[minmax(132px,168px)_minmax(0,1fr)] gap-x-3 gap-y-1 border-b border-slate-200/50 px-0 py-2 text-left last:border-b-0 dark:border-white/8`}
    >
      <span className="text-left text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-700 dark:text-white">
        {label}
      </span>
      <Tooltip content={title} className="min-w-0">
        <span
          className={`${breakValue ? "break-all" : ""} min-w-0 text-left text-[0.9rem] leading-5 ${valueClassName}`}
        >
          {value}
        </span>
      </Tooltip>
    </div>
  );
}
