import { OperationResult } from '@urql/core'

export type Address = string

export type Network = {
  name: string
  chainId: number
  ensAddress: Address
}

export type Networkish =
  | { chainId?: number; ensAddress?: Address; name?: string }
  | string
  | number

export type QueryResult = OperationResult<any>
