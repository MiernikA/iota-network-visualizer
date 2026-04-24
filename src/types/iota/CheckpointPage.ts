import type { CheckpointItem } from "./CheckpointItem";

export type CheckpointPage = {
  data: CheckpointItem[]
  hasNextPage: boolean
  nextCursor: string | null
}
