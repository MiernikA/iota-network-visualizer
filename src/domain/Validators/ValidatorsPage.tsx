import { SurfaceCard } from "../../shared/components/SurfaceCard";
import type { DashboardSnapshot } from "../../types/dashboard/DashboardSnapshot";
import { useValidatorsViewModel } from "./data/hooks/useValidatorsViewModel";
import { SORT_LABELS, TABLE_COLUMNS } from "./data/validatorsConfig";
import { ValidatorsSummaryCards } from "./components/summary/ValidatorsSummaryCards";
import { ValidatorsFullscreenDialog } from "./components/table/ValidatorsFullscreenDialog";
import { ValidatorsPagination } from "./components/table/ValidatorsPagination";
import { ValidatorsTable } from "./components/table/core/ValidatorsTable";
import { ValidatorsToolbar } from "./components/table/ValidatorsToolbar";

type Props = {
  snapshot: DashboardSnapshot;
};

export function ValidatorsPage({ snapshot }: Props) {
  const viewModel = useValidatorsViewModel(snapshot.validators, 10);

  const tableProps = {
    validators: viewModel.visibleValidators,
    expandedValidator: viewModel.expandedValidator,
    isTableFullscreen: viewModel.isTableFullscreen,
    sortKey: viewModel.sortKey,
    sortDirection: viewModel.sortDirection,
    tableColumns: TABLE_COLUMNS,
    sortLabels: SORT_LABELS,
    onSort: viewModel.handleSort,
    onToggleExpanded: viewModel.toggleExpanded,
  };

  return (
    <div className="space-y-6">
      <ValidatorsSummaryCards snapshot={snapshot} />

      <SurfaceCard className="p-4 sm:p-5">
        <ValidatorsToolbar
          filterQuery={viewModel.filterQuery}
          isTableFullscreen={viewModel.isTableFullscreen}
          visibleStart={viewModel.visibleStart}
          visibleEnd={viewModel.visibleEnd}
          totalCount={viewModel.totalCount}
          onFilterChange={viewModel.setFilterQuery}
          onToggleFullscreen={viewModel.toggleFullscreen}
        />
        <ValidatorsTable {...tableProps} />
        {!viewModel.isTableFullscreen ? (
          <ValidatorsPagination
            rowsPerPage={viewModel.rowsPerPage}
            visibleStart={viewModel.visibleStart}
            visibleEnd={viewModel.visibleEnd}
            totalCount={viewModel.totalCount}
            currentPage={viewModel.safeCurrentPage}
            totalPages={viewModel.totalPages}
            onRowsPerPageChange={viewModel.setRowsPerPage}
            onPreviousPage={viewModel.goToPreviousPage}
            onNextPage={viewModel.goToNextPage}
          />
        ) : null}
      </SurfaceCard>

      {viewModel.isTableFullscreen ? (
        <ValidatorsFullscreenDialog
          filterQuery={viewModel.filterQuery}
          visibleStart={viewModel.visibleStart}
          visibleEnd={viewModel.visibleEnd}
          totalCount={viewModel.totalCount}
          onFilterChange={viewModel.setFilterQuery}
          onClose={viewModel.closeFullscreen}
          tableProps={tableProps}
        />
      ) : null}
    </div>
  );
}
