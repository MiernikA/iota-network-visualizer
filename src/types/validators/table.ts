import type { ValidatorSnapshot } from "./ValidatorSnapshot";

export type SortKey =
  | "name"
  | "stake"
  | "apy"
  | "commissionRate"
  | "nextEpochStake"
  | "votingPower";

export type SortDirection = "asc" | "desc";

export type TableColumn = {
  key: SortKey;
  widthClassName: string;
};

type SortHandler = (..._args: [SortKey]) => void;
type ToggleExpandedHandler = (..._args: [string]) => void;

export type ValidatorsTableProps = {
  validators: ValidatorSnapshot[];
  expandedValidator: string | null;
  isTableFullscreen: boolean;
  sortKey: SortKey;
  sortDirection: SortDirection;
  tableColumns: TableColumn[];
  sortLabels: Record<SortKey, string>;
  onSort: SortHandler;
  onToggleExpanded: ToggleExpandedHandler;
};
