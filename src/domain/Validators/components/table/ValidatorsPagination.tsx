import { PAGE_SIZE_OPTIONS } from "../../data/validatorsConfig";

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
      <path
        d="M12.5 4.5 7 10l5.5 5.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
      <path
        d="M7.5 4.5 13 10l-5.5 5.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-3.5 w-3.5">
      <path
        d="M5 7.5 10 12.5l5-5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

type Props = {
  rowsPerPage: number;
  visibleStart: number;
  visibleEnd: number;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onRowsPerPageChange: (_value: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
};

export function ValidatorsPagination({
  rowsPerPage,
  visibleStart,
  visibleEnd,
  totalCount,
  currentPage,
  totalPages,
  onRowsPerPageChange,
  onPreviousPage,
  onNextPage,
}: Props) {
  return (
    <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 px-2 pt-3 text-sm text-slate-700 dark:border-white/10 dark:text-white sm:flex-row sm:items-center sm:justify-end sm:gap-5">
      <label className="flex items-center gap-2.5">
        <span>Rows per page:</span>
        <div className="relative min-w-14">
          <select
            value={rowsPerPage}
            onChange={(event) =>
              onRowsPerPageChange(Number(event.target.value))
            }
            className="h-9 appearance-none rounded-md bg-transparent pl-2 pr-7 text-sm text-slate-700 outline-none transition hover:bg-[linear-gradient(135deg,rgba(244,253,246,0.96),rgba(235,248,239,0.9))] focus:bg-[linear-gradient(135deg,rgba(244,253,246,0.96),rgba(235,248,239,0.9))] dark:text-white dark:hover:bg-[linear-gradient(135deg,rgba(134,239,172,0.06),rgba(255,255,255,0.02))] dark:focus:bg-[linear-gradient(135deg,rgba(134,239,172,0.06),rgba(255,255,255,0.02))]"
            aria-label="Rows per page"
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option} className="text-slate-900">
                {option}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-700 dark:text-white">
            <ChevronDownIcon />
          </span>
        </div>
      </label>
      <p className="min-w-[8rem] px-1 text-left sm:text-right">
        {visibleStart}-{visibleEnd} of {totalCount}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onPreviousPage}
          disabled={currentPage === 1}
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition hover:bg-[linear-gradient(135deg,rgba(244,253,246,0.96),rgba(235,248,239,0.9))] disabled:cursor-not-allowed disabled:opacity-40 dark:text-white dark:hover:bg-[linear-gradient(135deg,rgba(134,239,172,0.06),rgba(255,255,255,0.02))]"
          aria-label="Previous page"
        >
          <ChevronLeftIcon />
        </button>
        <button
          type="button"
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition hover:bg-[linear-gradient(135deg,rgba(244,253,246,0.96),rgba(235,248,239,0.9))] disabled:cursor-not-allowed disabled:opacity-40 dark:text-white dark:hover:bg-[linear-gradient(135deg,rgba(134,239,172,0.06),rgba(255,255,255,0.02))]"
          aria-label="Next page"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}
