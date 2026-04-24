import { ValidatorsTable } from "./core/ValidatorsTable";
import { ValidatorsToolbar } from "./ValidatorsToolbar";
import type { ValidatorsTableProps } from "../../../../types/validators/table";

type Props = {
  filterQuery: string;
  visibleStart: number;
  visibleEnd: number;
  totalCount: number;
  onFilterChange: (_value: string) => void;
  onClose: () => void;
  tableProps: ValidatorsTableProps;
};

export function ValidatorsFullscreenDialog({
  filterQuery,
  visibleStart,
  visibleEnd,
  totalCount,
  onFilterChange,
  onClose,
  tableProps,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-[radial-gradient(circle_at_50%_100%,rgba(134,239,172,0.08),transparent_40%),rgba(2,6,23,0.56)] backdrop-blur-sm">
      <div className="flex h-full flex-col overflow-hidden">
        <div
          className="border border-slate-500/70 bg-[linear-gradient(160deg,#d2dbe4,#c7d1ca_48%,#bcc7c0)] shadow-[0_20px_70px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-[radial-gradient(circle_at_12%_12%,rgba(134,239,172,0.08),transparent_30%),linear-gradient(160deg,#020617,#0c1f18_52%,#0f172a)] dark:shadow-[0_20px_70px_rgba(2,6,23,0.35)] flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-none border-0 p-0 shadow-none"
        >
          <div className="border-b border-white/10 px-4 py-4 sm:px-5">
            <div>
              <p className="font-['Space_Grotesk'] text-xl font-semibold text-slate-900 dark:text-white">
                Validator Table
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Fullscreen view for inspecting the active validator set.
              </p>
            </div>
          </div>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-4 sm:px-5">
            <ValidatorsToolbar
              filterQuery={filterQuery}
              isTableFullscreen
              visibleStart={visibleStart}
              visibleEnd={visibleEnd}
              totalCount={totalCount}
              onFilterChange={onFilterChange}
              onToggleFullscreen={onClose}
            />
            <div className="min-h-0 flex-1 overflow-hidden">
              <ValidatorsTable {...tableProps} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
