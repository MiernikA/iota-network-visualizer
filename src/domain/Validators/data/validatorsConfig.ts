import type { SortKey, TableColumn } from "../../../types/validators/table";

export const SORT_LABELS: Record<SortKey, string> = {
  name: "Name",
  stake: "Stake",
  apy: "APY",
  commissionRate: "Commission",
  nextEpochStake: "Next Epoch Stake",
  votingPower: "Voting Power",
};

export const PAGE_SIZE_OPTIONS = [10, 25, 50];

export const TABLE_COLUMNS: TableColumn[] = [
  { key: "name", widthClassName: "w-[30%]" },
  { key: "stake", widthClassName: "w-[16%]" },
  { key: "apy", widthClassName: "w-[12%]" },
  { key: "commissionRate", widthClassName: "w-[12%]" },
  { key: "nextEpochStake", widthClassName: "w-[18%]" },
  { key: "votingPower", widthClassName: "w-[12%]" },
];
