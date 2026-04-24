import type { IotaValidator } from "./IotaValidator";

export type IotaSystemStateV2 = {
  epoch: string
  iotaTotalSupply: string
  totalStake: string
  activeValidators: IotaValidator[]
}
