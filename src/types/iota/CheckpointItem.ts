export type CheckpointItem = {
  epoch: string
  sequenceNumber: string
  digest: string
  networkTotalTransactions: string
  timestampMs: string
  transactions?: string[]
}
