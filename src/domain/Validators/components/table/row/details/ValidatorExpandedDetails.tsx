import { formatPercent } from "../../../../../../shared/utils/formatters";
import type { ValidatorSnapshot } from "../../../../../../types/validators/ValidatorSnapshot";
import { ValidatorDetailRow } from "./ValidatorDetailRow";
import {
  formatOptionalIota,
  formatRpcNumber,
  formatStakeDelta,
} from "../../../../utils/validators.utils";

const IOTA_EXPLORER_ADDRESS_URL = import.meta.env
  .VITE_IOTA_EXPLORER_ADDRESS_URL;

type Props = {
  validator: ValidatorSnapshot;
  delta: number;
  isTableFullscreen: boolean;
  tableColumnCount: number;
};

export function ValidatorExpandedDetails({
  validator,
  delta,
  isTableFullscreen,
  tableColumnCount,
}: Props) {
  const explorerBaseUrl = IOTA_EXPLORER_ADDRESS_URL?.trim();
  const explorerUrl = explorerBaseUrl
    ? `${explorerBaseUrl}/${validator.address}?network=mainnet`
    : null;

  return (
    <tr className="border-t border-slate-200/70 bg-[linear-gradient(180deg,#dce3eb,#d2ddd5)] dark:border-white/10 dark:bg-[linear-gradient(180deg,#10211a,#12251d)]">
      <td
        colSpan={tableColumnCount}
        className={isTableFullscreen ? "px-0 py-0" : "px-4 py-4"}
      >
        <div
          data-validator-details={validator.address}
          className={isTableFullscreen ? "px-3 py-3" : "px-1 py-1.5"}
        >
          <div className="grid gap-x-6">
            <ValidatorDetailRow
              label="Full Address"
              value={validator.address}
              breakValue
            />
            <ValidatorDetailRow
              label="Project URL"
              value={
                validator.projectUrl ? (
                  <a
                    href={validator.projectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-600 underline decoration-emerald-500/40 underline-offset-2 transition hover:text-emerald-500 dark:text-emerald-200 dark:hover:text-emerald-100"
                  >
                    {validator.projectUrl}
                  </a>
                ) : (
                  "--"
                )
              }
              breakValue
            />
            <ValidatorDetailRow
              label="IOTA Explorer"
              value={
                explorerUrl ? (
                  <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-600 underline decoration-emerald-500/40 underline-offset-2 transition hover:text-emerald-500 dark:text-emerald-200 dark:hover:text-emerald-100"
                  >
                    Open validator address
                  </a>
                ) : (
                  <span className="text-slate-500 dark:text-slate-400">
                    Configure `VITE_IOTA_EXPLORER_ADDRESS_URL`
                  </span>
                )
              }
            />
            <ValidatorDetailRow
              label="Stake Delta"
              value={formatStakeDelta(delta)}
              valueClassName={`font-semibold ${
                delta >= 0
                  ? "text-emerald-600 dark:text-emerald-200"
                  : "text-rose-600 dark:text-rose-300"
              }`}
            />
            <ValidatorDetailRow
              label="Description"
              value={validator.description || "--"}
            />
            <ValidatorDetailRow
              label="Staking Pool ID"
              value={validator.stakingPoolId || "--"}
              breakValue
            />
            <ValidatorDetailRow
              label="Effective Commission"
              value={formatPercent(validator.effectiveCommissionRate)}
            />
            <ValidatorDetailRow
              label="Next Epoch Commission"
              value={formatPercent(validator.nextEpochCommissionRate)}
            />
            <ValidatorDetailRow
              label="Pending Stake"
              value={formatOptionalIota(validator.pendingStake)}
            />
            <ValidatorDetailRow
              label="Rewards Pool"
              value={formatOptionalIota(validator.rewardsPool)}
            />
            <details
              className="border border-slate-500/70 bg-[linear-gradient(155deg,#d4dde6,#cad4cd,#c0cbc4)] dark:border-white/12 dark:bg-[radial-gradient(circle_at_14%_16%,rgba(134,239,172,0.06),transparent_32%),linear-gradient(155deg,#08120f,#0d1b15,#111827)] mt-3 rounded-xl px-4 py-3"
            >
              <summary className="cursor-pointer list-none text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-700 dark:text-white">
                Technical Details
              </summary>
              <div className="mt-3 grid gap-x-6">
                <ValidatorDetailRow
                  label="Gas Price"
                  value={formatRpcNumber(validator.gasPrice)}
                />
                <ValidatorDetailRow
                  label="Net Address"
                  value={validator.netAddress || "--"}
                  breakValue
                />
                <ValidatorDetailRow
                  label="P2P Address"
                  value={validator.p2pAddress || "--"}
                  breakValue
                />
                <ValidatorDetailRow
                  label="Primary Address"
                  value={validator.primaryAddress || "--"}
                  breakValue
                />
              </div>
            </details>
          </div>
        </div>
      </td>
    </tr>
  );
}
