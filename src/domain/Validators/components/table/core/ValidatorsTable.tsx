import { useRef } from "react";
import type { ValidatorsTableProps } from "../../../../../types/validators/table";
import { ValidatorRow } from "../row/ValidatorRow";
import { ValidatorsTableHeader } from "./ValidatorsTableHeader";

export function ValidatorsTable({
  validators,
  expandedValidator,
  isTableFullscreen,
  sortKey,
  sortDirection,
  tableColumns,
  sortLabels,
  onSort,
  onToggleExpanded,
}: ValidatorsTableProps) {
  const tableScrollContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      className={
        isTableFullscreen
          ? "flex h-full min-h-0 flex-col"
          : "overflow-hidden rounded-[1.2rem] border border-slate-500/70 bg-[linear-gradient(180deg,#d4dde6,#cad4cd,#c0cbc3)] dark:border-white/12 dark:bg-[radial-gradient(circle_at_10%_10%,rgba(134,239,172,0.06),transparent_28%),linear-gradient(180deg,#050c13,#0a1612,#0f172a)]"
      }
    >
      <div
        ref={tableScrollContainerRef}
        className={
          isTableFullscreen
            ? "min-h-0 flex-1 overflow-y-auto overflow-x-auto"
            : "overflow-x-auto"
        }
      >
        <table
          className="bg-[linear-gradient(180deg,#e4eaf1,#dae3dc)] dark:bg-[linear-gradient(180deg,#091019,#0c1512)] mx-auto w-full table-fixed text-center"
        >
          <colgroup>
            {tableColumns.map((column) => (
              <col key={column.key} className={column.widthClassName} />
            ))}
          </colgroup>
          <ValidatorsTableHeader
            tableColumns={tableColumns}
            sortKey={sortKey}
            sortDirection={sortDirection}
            sortLabels={sortLabels}
            onSort={onSort}
          />
          <tbody>
            {validators.map((validator) => (
              <ValidatorRow
                key={validator.address}
                validator={validator}
                isExpanded={expandedValidator === validator.address}
                isTableFullscreen={isTableFullscreen}
                tableColumnCount={tableColumns.length}
                onToggleExpanded={onToggleExpanded}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
