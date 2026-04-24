import { Tooltip } from "../../../../../shared/components/Tooltip";
import type {
  SortDirection,
  SortKey,
  TableColumn,
} from "../../../../../types/validators/table";
import { getColumnTooltip } from "../../../utils/validators.utils";

function SortIndicator({
  sortKey,
  sortDirection,
  currentKey,
}: {
  sortKey: SortKey;
  sortDirection: SortDirection;
  currentKey: SortKey;
}) {
  if (sortKey !== currentKey) {
    return (
      <span className="w-4 text-center text-[0.72rem] leading-none text-slate-400 dark:text-slate-500">
        +/-
      </span>
    );
  }

  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={`h-3.5 w-3.5 text-emerald-500 transition-transform duration-150 dark:text-emerald-200 ${
        sortDirection === "desc" ? "rotate-180" : "rotate-0"
      }`}
    >
      <path
        d="M5 12.5 10 7.5l5 5"
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
  tableColumns: TableColumn[];
  sortKey: SortKey;
  sortDirection: SortDirection;
  sortLabels: Record<SortKey, string>;
  onSort: (..._args: [SortKey]) => void;
};

export function ValidatorsTableHeader({
  tableColumns,
  sortKey,
  sortDirection,
  sortLabels,
  onSort,
}: Props) {
  return (
    <thead
      className="bg-[linear-gradient(180deg,#c8d1db,#bec9c2)] text-slate-800 dark:bg-[linear-gradient(180deg,#08120f,#0a1612)] dark:text-slate-400 sticky top-0 z-10 text-[0.7rem] uppercase tracking-[0.08em]"
    >
      <tr>
        {tableColumns.map(({ key }) => (
          <th key={key} className="px-3 py-3 text-center align-middle sm:px-4">
            <Tooltip content={getColumnTooltip(key)}>
              <button
                type="button"
                onClick={() => onSort(key)}
                aria-label={getColumnTooltip(key) ?? sortLabels[key]}
                className="group inline-flex min-h-8 w-full items-center justify-center gap-1.5 rounded-md px-1 text-center text-[0.72rem] font-semibold tracking-[-0.01em] text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                <span className="break-words whitespace-normal leading-tight">
                  {sortLabels[key]}
                </span>
                <SortIndicator
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  currentKey={key}
                />
              </button>
            </Tooltip>
          </th>
        ))}
      </tr>
    </thead>
  );
}
