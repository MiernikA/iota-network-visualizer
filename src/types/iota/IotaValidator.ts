export type IotaValidator = {
  iotaAddress: string
  authorityPubkeyBytes?: string | null
  networkPubkeyBytes?: string | null
  protocolPubkeyBytes?: string | null
  proofOfPossessionBytes?: string | null
  name: string
  description?: string
  imageUrl?: string
  projectUrl?: string
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
  stakingPoolIotaBalance: string
  nextEpochStake: string
  commissionRate: string
  effectiveCommissionRate?: string
  votingPower: string
  operationCapId?: string
  gasPrice?: string
  nextEpochGasPrice?: string
  nextEpochCommissionRate?: string
  stakingPoolId?: string
  stakingPoolActivationEpoch?: string
  stakingPoolDeactivationEpoch?: string | null
  rewardsPool?: string
  poolTokenBalance?: string
  pendingStake?: string
  pendingTotalIotaWithdraw?: string
  pendingPoolTokenWithdraw?: string
  exchangeRatesId?: string
  exchangeRatesSize?: string
}
