import { useEffect, useMemo, useState } from "react";
import type { ValidatorSnapshot } from "../../../../types/validators/ValidatorSnapshot";
import { matchesValidatorQuery, sortValidators } from "../../utils/validators.utils";
import type {
  SortDirection,
  SortKey,
} from "../../../../types/validators/table";

export function useValidatorsViewModel(
  validators: ValidatorSnapshot[],
  defaultRowsPerPage: number,
) {
  const [filterQuery, setFilterQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("stake");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [expandedValidator, setExpandedValidator] = useState<string | null>(null);
  const [isTableFullscreen, setIsTableFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  useEffect(() => {
    if (!isTableFullscreen) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsTableFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isTableFullscreen]);

  const filteredValidators = useMemo(() => {
    const normalizedQuery = filterQuery.trim().toLowerCase();
    return validators.filter((validator) =>
      matchesValidatorQuery(validator, normalizedQuery),
    );
  }, [filterQuery, validators]);

  const sortedValidators = useMemo(
    () => sortValidators(filteredValidators, sortKey, sortDirection),
    [filteredValidators, sortDirection, sortKey],
  );

  const totalPages = Math.max(1, Math.ceil(sortedValidators.length / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStartIndex = (safeCurrentPage - 1) * rowsPerPage;
  const pageEndIndex = pageStartIndex + rowsPerPage;
  const visibleValidators = isTableFullscreen
    ? sortedValidators
    : sortedValidators.slice(pageStartIndex, pageEndIndex);
  const visibleStart = sortedValidators.length === 0 ? 0 : isTableFullscreen ? 1 : pageStartIndex + 1;
  const visibleEnd = isTableFullscreen
    ? sortedValidators.length
    : Math.min(pageEndIndex, sortedValidators.length);

  return {
    filterQuery,
    sortKey,
    sortDirection,
    expandedValidator,
    isTableFullscreen,
    rowsPerPage,
    safeCurrentPage,
    totalPages,
    totalCount: sortedValidators.length,
    visibleStart,
    visibleEnd,
    visibleValidators,
    setFilterQuery: (value: string) => {
      setFilterQuery(value);
      setCurrentPage(1);
    },
    toggleFullscreen: () => setIsTableFullscreen((value) => !value),
    closeFullscreen: () => setIsTableFullscreen(false),
    handleSort: (nextSortKey: SortKey) => {
      setCurrentPage(1);

      if (sortKey === nextSortKey) {
        setSortDirection((value) => (value === "desc" ? "asc" : "desc"));
        return;
      }

      setSortKey(nextSortKey);
      setSortDirection(nextSortKey === "name" ? "asc" : "desc");
    },
    toggleExpanded: (address: string) => {
      setExpandedValidator((value) => (value === address ? null : address));
    },
    setRowsPerPage: (value: number) => {
      setRowsPerPage(value);
      setCurrentPage(1);
    },
    goToPreviousPage: () => setCurrentPage(Math.max(1, safeCurrentPage - 1)),
    goToNextPage: () => setCurrentPage(Math.min(totalPages, safeCurrentPage + 1)),
  };
}
