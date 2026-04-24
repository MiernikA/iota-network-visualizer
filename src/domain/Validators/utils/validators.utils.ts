import { formatCompact, formatIota } from "../../../shared/utils/formatters";
import type { ValidatorSnapshot } from "../../../types/validators/ValidatorSnapshot";
import type { SortDirection, SortKey } from "../../../types/validators/table";

export function formatOverviewIota(value: number) {
  const valueInIota = value / 1_000_000_000;

  if (Math.abs(valueInIota) >= 1_000_000) {
    return `${valueInIota >= 0 ? "" : "-"}${formatCompact(Math.abs(valueInIota), 2)} IOTA`;
  }

  return `${formatIota(value)} IOTA`;
}

export function formatOptionalIota(value: number) {
  return `${formatIota(value)} IOTA`;
}

export function formatRpcNumber(value: number) {
  return new Intl.NumberFormat(undefined).format(value);
}

export function formatStakeDelta(delta: number) {
  return `${delta >= 0 ? "+" : ""}${formatIota(delta)} IOTA`;
}

export function formatStakeDeltaCompact(delta: number) {
  return `${delta >= 0 ? "+" : ""}${formatCompact(delta / 1_000_000_000, 2)} IOTA`;
}

export function formatVotingPower(value: number, digits = 2) {
  return `${new Intl.NumberFormat(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value / 100)}%`;
}

export function getColumnTooltip(key: SortKey) {
  if (key === "stake") {
    return "Stake = total IOTA delegated to this validator's staking pool.";
  }

  if (key === "votingPower") {
    return "Voting Power = validator consensus voting weight (shown as a percentage).";
  }

  return undefined;
}

export function matchesValidatorQuery(
  validator: ValidatorSnapshot,
  normalizedQuery: string,
) {
  if (!normalizedQuery) {
    return true;
  }

  return (
    validator.name.toLowerCase().includes(normalizedQuery) ||
    validator.address.toLowerCase().includes(normalizedQuery)
  );
}

function getSortValue(validator: ValidatorSnapshot, sortKey: SortKey) {
  if (sortKey === "name") {
    return validator.name;
  }

  return validator[sortKey];
}

export function sortValidators(
  validators: ValidatorSnapshot[],
  sortKey: SortKey,
  sortDirection: SortDirection,
) {
  return [...validators].sort((left, right) => {
    const directionFactor = sortDirection === "desc" ? -1 : 1;

    if (sortKey === "name") {
      return (
        String(getSortValue(left, sortKey)).localeCompare(
          String(getSortValue(right, sortKey)),
        ) * directionFactor
      );
    }

    return (
      (Number(getSortValue(left, sortKey)) -
        Number(getSortValue(right, sortKey))) *
      directionFactor
    );
  });
}
