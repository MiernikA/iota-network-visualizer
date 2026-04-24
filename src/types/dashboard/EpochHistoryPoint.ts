export type EpochHistoryPoint = {
  label: string
  epoch: number
  timestampMs: number
  totalTransactions: number
  totalStake: number
  validatorCount: number
  enteredValidators: number
  exitedValidators: number
  avgFeePerTx: number
}
