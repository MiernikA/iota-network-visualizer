export type ValidatorSnapshot = {
  address: string
  name: string
  description: string
  imageUrl?: string
  projectUrl?: string
  authorityPubkeyBytes?: string | null
  networkPubkeyBytes?: string | null
  protocolPubkeyBytes?: string | null
  proofOfPossessionBytes?: string | null
  netAddress?: string | null
  p2pAddress?: string | null
  primaryAddress?: string | null
  nextEpochAuthorityPubkeyBytes?: string | null
  nextEpochProofOfPossession?: string | null
  nextEpochNetworkPubkeyBytes?: string | null
  nextEpochProtocolPubkeyBytes?: string | null
  nextEpochNetAddress?: string | null
  nextEpochP2pAddress?: string | null
  nextEpochPrimaryAddress?: string | null
  stake: number
  nextEpochStake: number
  commissionRate: number
  effectiveCommissionRate: number
  votingPower: number
  apy: number
  gasPrice: number
  nextEpochGasPrice: number
  nextEpochCommissionRate: number
  operationCapId?: string
  stakingPoolId?: string
  stakingPoolActivationEpoch?: number
  stakingPoolDeactivationEpoch?: number | null
  rewardsPool: number
  poolTokenBalance: number
  pendingStake: number
  pendingTotalIotaWithdraw: number
  pendingPoolTokenWithdraw: number
  exchangeRatesId?: string
  exchangeRatesSize?: number
}
