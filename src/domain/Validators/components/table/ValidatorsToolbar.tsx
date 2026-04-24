function FullscreenIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        d={
          collapsed
            ? "M9 9H5V5m10 0h4v4M9 15H5v4m10-4h4v4"
            : "M8 3H5a2 2 0 0 0-2 2v3m16 0V5a2 2 0 0 0-2-2h-3M8 21H5a2 2 0 0 1-2-2v-3m16 0v3a2 2 0 0 1-2 2h-3"
        }
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
  filterQuery: string;
  isTableFullscreen: boolean;
  visibleStart: number;
  visibleEnd: number;
  totalCount: number;
  onFilterChange: (_value: string) => void;
  onToggleFullscreen: () => void;
};

export function ValidatorsToolbar({
  filterQuery,
  isTableFullscreen,
  visibleStart,
  visibleEnd,
  totalCount,
  onFilterChange,
  onToggleFullscreen,
}: Props) {
  return (
    <div className="mb-4 flex flex-col gap-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="font-['Space_Grotesk'] text-xl font-semibold text-slate-900 dark:text-white">
            Validator List
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 xl:justify-end">
          <div
            className="border border-slate-500/70 bg-[linear-gradient(155deg,#d4dde6,#cad4cd,#c0cbc4)] dark:border-white/12 dark:bg-[radial-gradient(circle_at_14%_16%,rgba(134,239,172,0.06),transparent_32%),linear-gradient(155deg,#08120f,#0d1b15,#111827)] rounded-xl px-3 py-2.5 text-sm text-slate-700 dark:text-white"
          >
            Showing {visibleStart}-{visibleEnd} of {totalCount}
          </div>
          <button
            type="button"
            onClick={onToggleFullscreen}
            aria-label={
              isTableFullscreen ? "Exit fullscreen" : "Open fullscreen"
            }
            title={isTableFullscreen ? "Exit fullscreen" : "Open fullscreen"}
            className="border border-slate-500/70 bg-[linear-gradient(155deg,#d4dde6,#cad4cd,#c0cbc4)] dark:border-white/12 dark:bg-[radial-gradient(circle_at_14%_16%,rgba(134,239,172,0.06),transparent_32%),linear-gradient(155deg,#08120f,#0d1b15,#111827)] inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-600 transition hover:-translate-y-px hover:border-emerald-200 hover:text-emerald-500 active:translate-y-0 dark:text-slate-300 dark:hover:border-emerald-200/40 dark:hover:text-emerald-200"
          >
            <FullscreenIcon collapsed={isTableFullscreen} />
          </button>
        </div>
      </div>

      <label className="w-full sm:max-w-sm">
        <input
          type="text"
          value={filterQuery}
          onChange={(event) => onFilterChange(event.target.value)}
          placeholder="Filter by name..."
          className="border border-slate-500/70 bg-[linear-gradient(155deg,#d4dde6,#cad4cd,#c0cbc4)] dark:border-white/12 dark:bg-[radial-gradient(circle_at_14%_16%,rgba(134,239,172,0.06),transparent_32%),linear-gradient(155deg,#08120f,#0d1b15,#111827)] h-11 w-full rounded-xl px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-600 focus:border-emerald-200 dark:text-white dark:placeholder:text-slate-300 dark:focus:border-emerald-200/40"
          aria-label="Filter validators by name"
        />
      </label>
    </div>
  );
}
