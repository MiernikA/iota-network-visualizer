import { Fragment } from "react";
import { formatIota, formatPercent, formatShortHash } from "../../../../../shared/utils/formatters";
import type { ValidatorSnapshot } from "../../../../../types/validators/ValidatorSnapshot";

import {
  formatStakeDeltaCompact,
  formatVotingPower,
} from "../../../utils/validators.utils";
import { ValidatorExpandedDetails } from "./details/ValidatorExpandedDetails";

function DisclosureIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={`h-4 w-4 transition-[transform,color] duration-150 ${
        expanded
          ? "rotate-90 text-emerald-600 dark:text-emerald-200"
          : "rotate-0 text-slate-700 dark:text-slate-300"
      }`}
    >
      <path
        d="M7.5 5.5 12.5 10l-5 4.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
      />
    </svg>
  );
}

type Props = {
  validator: ValidatorSnapshot;
  isExpanded: boolean;
  isTableFullscreen: boolean;
  tableColumnCount: number;
  onToggleExpanded: (..._args: [string]) => void;
};

export function ValidatorRow({
  validator,
  isExpanded,
  isTableFullscreen,
  tableColumnCount,
  onToggleExpanded,
}: Props) {
  const delta = validator.nextEpochStake - validator.stake;
  const toggleExpanded = () => onToggleExpanded(validator.address);

  return (
    <Fragment>
      <tr
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={toggleExpanded}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleExpanded();
          }
        }}
        className="border-t border-slate-200 bg-[linear-gradient(180deg,#e8edf3,#dde6df)] text-sm text-slate-700 transition hover:bg-[linear-gradient(180deg,#dce3eb,#d2ddd5)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200/50 dark:border-white/10 dark:bg-[linear-gradient(180deg,#0d1520,#0f1915)] dark:text-slate-200 dark:hover:bg-[linear-gradient(180deg,#10211a,#11231c)] dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] cursor-pointer align-middle"
      >
        <td className="px-3 py-4 align-middle text-center sm:px-4">
          <div className="relative mx-auto flex min-h-[3.2rem] max-w-[18rem] items-center justify-center pl-6">
            <span className="absolute left-0 top-1/2 -translate-y-1/2">
              <DisclosureIcon expanded={isExpanded} />
            </span>
            <div className="min-w-0">
              <div className="flex items-center justify-center gap-2">
                {validator.imageUrl ? (
                  <img
                    src={validator.imageUrl}
                    alt={`${validator.name} logo`}
                    className="h-8 w-8 shrink-0 rounded-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[0.7rem] font-semibold uppercase text-emerald-700 dark:bg-emerald-200/15 dark:text-emerald-200">
                    {validator.name.slice(0, 1)}
                  </span>
                )}
                <p className="max-w-[11rem] truncate text-left font-['Space_Grotesk'] text-[0.98rem] font-semibold leading-tight text-slate-900 dark:text-white">
                  {validator.name}
                </p>
              </div>
              <p className="mt-1 break-all text-[0.68rem] leading-tight text-slate-500 dark:text-slate-400">
                {formatShortHash(validator.address)}
              </p>
            </div>
          </div>
        </td>
        <td className="break-words px-3 py-4 align-middle text-center text-[0.82rem] font-semibold leading-tight text-slate-800 dark:text-slate-100 sm:px-4">
          {formatIota(validator.stake)} IOTA
        </td>
        <td className="break-words px-3 py-4 align-middle text-center text-[0.82rem] font-semibold leading-tight text-emerald-500 dark:text-emerald-200 sm:px-4">
          {formatPercent(validator.apy * 100)}
        </td>
        <td className="break-words px-3 py-4 align-middle text-center text-[0.8rem] leading-tight text-slate-600 dark:text-slate-300 sm:px-4">
          {formatPercent(validator.commissionRate)}
        </td>
        <td className="px-3 py-4 align-middle text-center text-[0.8rem] leading-tight text-slate-900 dark:text-white sm:px-4">
          <div className="mx-auto flex min-h-[3.1rem] max-w-[12rem] flex-col items-center justify-center text-center">
            <div className="break-words font-semibold leading-snug tabular-nums text-slate-950 dark:text-white">
              {formatIota(validator.nextEpochStake)} IOTA
            </div>
            <div
              className={`mt-1 break-words text-[0.68rem] leading-snug tabular-nums ${
                delta >= 0
                  ? "text-emerald-600 dark:text-emerald-100"
                  : "text-rose-700 dark:text-rose-200"
              }`}
            >
              {formatStakeDeltaCompact(delta)}
            </div>
          </div>
        </td>
        <td className="break-words px-3 py-4 align-middle text-center text-[0.8rem] leading-tight text-slate-600 dark:text-slate-300 sm:px-4">
          {formatVotingPower(validator.votingPower, 2)}
        </td>
      </tr>

      {isExpanded ? (
        <ValidatorExpandedDetails
          validator={validator}
          delta={delta}
          isTableFullscreen={isTableFullscreen}
          tableColumnCount={tableColumnCount}
        />
      ) : null}
    </Fragment>
  );
}
