import type { EpochItem } from "./EpochItem";

export type EpochPage = {
  data: EpochItem[]
  hasNextPage: boolean
  nextCursor: string | null
}
