import type { EpochHistoryPoint } from "./EpochHistoryPoint";
import type { FinalityPoint } from "./FinalityPoint";
import type { RecentCheckpointItem } from "./RecentCheckpointItem";
import type { TransactionBucket } from "./TransactionBucket";
import type { ValidatorSnapshot } from "../validators/ValidatorSnapshot";

export type DashboardSnapshot = {
  epoch: {
    validatorCount: number
  }
  staking: {
    totalStaked: number
    stakingRatio: number
    lastEpochGasFees: number
  }
  validators: ValidatorSnapshot[]
  transactionBuckets: TransactionBucket[]
  epochHistory: EpochHistoryPoint[]
  finalitySeries: FinalityPoint[]
  recentCheckpoints: RecentCheckpointItem[]
  recentFinalityMs: number
  networkTps: number
  checkpointIntervalMs: number
  latestCheckpointTransactionsCount: number
  averageTransactionsPerCheckpoint: number
  transactionsPerCheckpointSampleSize: number
  rollingTotalTransactions: number
  validatorDistribution: number
}
