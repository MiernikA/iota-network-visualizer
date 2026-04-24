export type EpochItem = {
  epoch: string
  epochStartTimestamp: string
  epochTotalTransactions: string
  firstCheckpointId: string
  validators: Array<{
    iotaAddress: string
    name: string
    stakingPoolIotaBalance: string
  }>
  endOfEpochInfo?: {
    epochEndTimestamp: string
    totalGasFees: string
    totalStake: string
    referenceGasPrice: string
  }
}
