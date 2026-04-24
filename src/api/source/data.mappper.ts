import type { DashboardSnapshot } from "../../types/dashboard/DashboardSnapshot";
import type { TransactionBucket } from "../../types/dashboard/TransactionBucket";
import type { CheckpointItem } from "../../types/iota/CheckpointItem";
import type { EpochItem } from "../../types/iota/EpochItem";
import type { LatestSystemStateResult } from "../../types/iota/LatestSystemStateResult";
import type { ValidatorsApyResult } from "../../types/iota/ValidatorsApyResult";
import type { ValidatorSnapshot } from "../../types/validators/ValidatorSnapshot";

const CHECKPOINT_METRIC_SAMPLE_SIZE = 100
const RECENT_CHECKPOINT_WINDOW_MS = 30_000

const timeBucketFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

function formatTimeBucket(timestampMs: number) {
  return timeBucketFormatter.format(new Date(timestampMs))
}

export function buildDashboardSnapshot({
  systemStateResult,
  apyResult,
  checkpoints,
  epochs,
}: {
  systemStateResult: LatestSystemStateResult
  apyResult: ValidatorsApyResult
  checkpoints: CheckpointItem[]
  epochs: EpochItem[]
}): DashboardSnapshot {
  const systemState = systemStateResult.V2

  const checkpointsAscending = checkpoints
    .slice()
    .sort((left, right) => Number(left.timestampMs) - Number(right.timestampMs))
  const checkpointsDescending = [...checkpointsAscending].reverse()

  const apyByAddress = new Map(apyResult.apys.map((entry) => [entry.address, entry.apy]))
  const validators: ValidatorSnapshot[] = systemState.activeValidators.map((validator) => ({
    address: validator.iotaAddress,
    authorityPubkeyBytes: validator.authorityPubkeyBytes,
    networkPubkeyBytes: validator.networkPubkeyBytes,
    protocolPubkeyBytes: validator.protocolPubkeyBytes,
    proofOfPossessionBytes: validator.proofOfPossessionBytes,
    name: validator.name,
    description: validator.description ?? '',
    imageUrl: validator.imageUrl,
    projectUrl: validator.projectUrl,
    netAddress: validator.netAddress,
    p2pAddress: validator.p2pAddress,
    primaryAddress: validator.primaryAddress,
    nextEpochAuthorityPubkeyBytes: validator.nextEpochAuthorityPubkeyBytes,
    nextEpochProofOfPossession: validator.nextEpochProofOfPossession,
    nextEpochNetworkPubkeyBytes: validator.nextEpochNetworkPubkeyBytes,
    nextEpochProtocolPubkeyBytes: validator.nextEpochProtocolPubkeyBytes,
    nextEpochNetAddress: validator.nextEpochNetAddress,
    nextEpochP2pAddress: validator.nextEpochP2pAddress,
    nextEpochPrimaryAddress: validator.nextEpochPrimaryAddress,
    stake: Number(validator.stakingPoolIotaBalance ?? '0'),
    nextEpochStake: Number(validator.nextEpochStake ?? '0'),
    commissionRate: Number(validator.commissionRate ?? '0') / 100,
    effectiveCommissionRate: Number(validator.effectiveCommissionRate ?? '0') / 100,
    votingPower: Number(validator.votingPower ?? '0'),
    apy: apyByAddress.get(validator.iotaAddress) ?? 0,
    gasPrice: Number(validator.gasPrice ?? '0'),
    nextEpochGasPrice: Number(validator.nextEpochGasPrice ?? '0'),
    nextEpochCommissionRate: Number(validator.nextEpochCommissionRate ?? '0') / 100,
    operationCapId: validator.operationCapId,
    stakingPoolId: validator.stakingPoolId,
    stakingPoolActivationEpoch: validator.stakingPoolActivationEpoch
      ? Number(validator.stakingPoolActivationEpoch)
      : undefined,
    stakingPoolDeactivationEpoch: validator.stakingPoolDeactivationEpoch
      ? Number(validator.stakingPoolDeactivationEpoch)
      : null,
    rewardsPool: Number(validator.rewardsPool ?? '0'),
    poolTokenBalance: Number(validator.poolTokenBalance ?? '0'),
    pendingStake: Number(validator.pendingStake ?? '0'),
    pendingTotalIotaWithdraw: Number(validator.pendingTotalIotaWithdraw ?? '0'),
    pendingPoolTokenWithdraw: Number(validator.pendingPoolTokenWithdraw ?? '0'),
    exchangeRatesId: validator.exchangeRatesId,
    exchangeRatesSize: validator.exchangeRatesSize ? Number(validator.exchangeRatesSize) : undefined,
  }))

  const buckets = new Map<number, TransactionBucket>()
  checkpointsAscending.forEach((checkpoint, index) => {
    const previous = checkpointsAscending[index - 1]
    if (!previous) return

    const timestampMs = Number(checkpoint.timestampMs)
    const previousTransactions = Number(previous.networkTotalTransactions ?? '0')
    const currentTransactions = Number(checkpoint.networkTotalTransactions ?? '0')
    const txCount = Math.max(
      currentTransactions - previousTransactions,
      checkpoint.transactions?.length ?? 0,
    )
    const bucketTimestamp = Math.floor(timestampMs / 5000) * 5000
    const currentBucket = buckets.get(bucketTimestamp) ?? {
      label: formatTimeBucket(bucketTimestamp),
      txCount: 0,
      timestampMs: bucketTimestamp,
    }

    currentBucket.txCount += txCount
    buckets.set(bucketTimestamp, currentBucket)
  })

  const transactionBuckets = [...buckets.values()].sort(
    (left, right) => left.timestampMs - right.timestampMs,
  )

  const sortedEpochs = [...epochs].sort(
    (left, right) =>
      Number(left.endOfEpochInfo?.epochEndTimestamp ?? left.epochStartTimestamp) -
      Number(right.endOfEpochInfo?.epochEndTimestamp ?? right.epochStartTimestamp),
  )
  const epochByNumber = new Map<number, EpochItem>(
    sortedEpochs.map((epoch) => [Number(epoch.epoch), epoch]),
  )

  const epochHistory = sortedEpochs
    .map((epoch) => {
      const previousEpoch = epochByNumber.get(Number(epoch.epoch) - 1)
      const currentValidators = new Set(epoch.validators.map((validator) => validator.iotaAddress))
      const previousValidators = new Set(
        previousEpoch?.validators.map((validator) => validator.iotaAddress) ?? [],
      )
      const enteredValidators = [...currentValidators].filter(
        (address) => !previousValidators.has(address),
      ).length
      const exitedValidators = [...previousValidators].filter(
        (address) => !currentValidators.has(address),
      ).length
      const totalTransactions = Number(epoch.epochTotalTransactions ?? '0')
      const totalGasFees = Number(epoch.endOfEpochInfo?.totalGasFees ?? '0')

      return {
        label: `E${epoch.epoch}`,
        epoch: Number(epoch.epoch),
        timestampMs: Number(epoch.endOfEpochInfo?.epochEndTimestamp ?? epoch.epochStartTimestamp),
        totalTransactions,
        totalStake: Number(epoch.endOfEpochInfo?.totalStake ?? '0'),
        validatorCount: epoch.validators.length,
        enteredValidators,
        exitedValidators,
        avgFeePerTx: totalTransactions > 0 ? totalGasFees / totalTransactions : 0,
      }
    })
    .filter((epoch) => Number.isFinite(epoch.timestampMs) && epoch.timestampMs > 0)

  const finalitySeries = checkpointsAscending.slice(1).map((checkpoint, index) => {
    const previous = checkpointsAscending[index]
    const timestampMs = Number(checkpoint.timestampMs)

    return {
      label: formatTimeBucket(timestampMs),
      timestampMs,
      finalityMs: Math.max(timestampMs - Number(previous.timestampMs), 0),
    }
  })

  const newestTimestampMs = Number(checkpointsDescending[0]?.timestampMs ?? 0)
  const recentWindow = checkpointsDescending.filter(
    (checkpoint) =>
      newestTimestampMs - Number(checkpoint.timestampMs) <= RECENT_CHECKPOINT_WINDOW_MS,
  )
  const recentCheckpoints = (
    recentWindow.length > 0 ? recentWindow : checkpointsDescending.slice(0, 12)
  ).map((checkpoint) => ({
    id: checkpoint.digest,
    sequenceNumber: Number(checkpoint.sequenceNumber),
    transactionsCount: checkpoint.transactions?.length ?? 0,
    timestampMs: Number(checkpoint.timestampMs),
  }))

  const totalStake = Number(systemState.totalStake)
  const totalSupply = Number(systemState.iotaTotalSupply)
  const stakingRatio = totalSupply > 0 ? (totalStake / totalSupply) * 100 : 0

  let latestEpochEndTimestampMs = 0
  let lastEpochGasFees = 0
  for (const epoch of epochs) {
    const endTimestampMs = Number(epoch.endOfEpochInfo?.epochEndTimestamp ?? 0)
    if (!Number.isFinite(endTimestampMs) || endTimestampMs <= 0) continue
    if (endTimestampMs <= latestEpochEndTimestampMs) continue
    latestEpochEndTimestampMs = endTimestampMs
    lastEpochGasFees = Number(epoch.endOfEpochInfo?.totalGasFees ?? 0)
  }

  const checkpointSample = checkpointsAscending.slice(-CHECKPOINT_METRIC_SAMPLE_SIZE)
  const checkpointDeltas = checkpointSample.slice(1).map((checkpoint, index) => {
    const previous = checkpointSample[index]
    return Number(checkpoint.timestampMs) - Number(previous.timestampMs)
  })
  const checkpointIntervalMs =
    checkpointDeltas.length > 0
      ? checkpointDeltas.reduce((sum, delta) => sum + delta, 0) / checkpointDeltas.length
      : 0

  const averageTransactionsPerCheckpoint =
    checkpointSample.length > 0
      ? checkpointSample.reduce((sum, checkpoint) => sum + (checkpoint.transactions?.length ?? 0), 0) /
        checkpointSample.length
      : 0

  const networkTps =
    checkpointIntervalMs > 0 ? (averageTransactionsPerCheckpoint / checkpointIntervalMs) * 1000 : 0

  const rollingTotalTransactions = Math.max(
    Number(checkpointsDescending[0]?.networkTotalTransactions ?? '0'),
    0,
  )

  const latestCheckpointTransactionsCount = checkpointsDescending[0]?.transactions?.length ?? 0

  const recentIntervalSource =
    recentWindow.length >= 2 ? recentWindow.slice().reverse() : checkpointsAscending.slice(-12)

  const finalityDeltas = recentIntervalSource.slice(1).map((checkpoint, index) => {
    const previous = recentIntervalSource[index]
    return Number(checkpoint.timestampMs) - Number(previous.timestampMs)
  })
  const recentFinalityMs =
    finalityDeltas.length > 0
      ? finalityDeltas.reduce((sum, delta) => sum + delta, 0) / finalityDeltas.length
      : 0

  const topTenStake = [...validators]
    .sort((left, right) => right.stake - left.stake)
    .slice(0, 10)
    .reduce((sum, validator) => sum + validator.stake, 0)
  const validatorDistribution = totalStake > 0 ? (topTenStake / totalStake) * 100 : 0

  return {
    epoch: {
      validatorCount: validators.length,
    },
    staking: {
      totalStaked: totalStake,
      stakingRatio,
      lastEpochGasFees,
    },
    validators,
    transactionBuckets,
    epochHistory,
    finalitySeries,
    recentCheckpoints,
    recentFinalityMs,
    networkTps,
    checkpointIntervalMs,
    latestCheckpointTransactionsCount,
    averageTransactionsPerCheckpoint,
    transactionsPerCheckpointSampleSize: CHECKPOINT_METRIC_SAMPLE_SIZE,
    rollingTotalTransactions,
    validatorDistribution,
  }
}
