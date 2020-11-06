import { OperationResult } from '@urql/core'

// Ethereum address
export type Address = string

// Chain ID
export type ChainId = number

// Ethereum network
export type Network = {
  chainId: number
  ensAddress: Address
  name: string
}

// Description of a network as specified from a configuration standpoint. It
// accepts an object, a string for network names, or a number for chain IDs.
export type Networkish =
  | {
      chainId?: number
      ensAddress?: Address
      name?: string
    }
  | string
  | number

export enum ContainerState {
  None,
  Scheduled,
  Approved,
  Challenged,
  Rejected,
  Cancelled,
  Executed,
}

export type CollateralData = {
  id: string
  token: string
  amount: string
}

export type RoleData = {
  id: string
  entity: Address
  selector: string
  who: Address
  granted: boolean
  frozen: boolean
}

export type ActionData = {
  id: string
  payload: ContainerPayload
  to: Address
  value: string
  data: string
}

export type ContainerPayload = {
  id: string
  container: ContainerData
  nonce: BigInt
  executionTime: BigInt
  submitter: string
  executor: DaoData
  actions: ActionData[]
  allowFailuresMap: string
  proof: string
}

export type ContainerData = {
  id: string
  queue: GovernQueueData
  state: ContainerState
  config: ConfigData
  payload: ContainerPayload
  history: ContainerEvent[]
}

export type DaoData = {
  id: string
  address: Address
  metadata: string
  registryEntries: RegistryEntryData[]
  containers: ContainerData[]
  roles: RoleData[]
}

export type GovernQueueData = {
  id: string
  address: Address
  config: ConfigData
  registryEntries: RegistryEntryData[]
  queued: ContainerData[]
  roles: RoleData[]
}

export type ConfigData = {
  id: string
  queue: GovernQueueData
  executionDelay: string
  scheduleDeposit: CollateralData
  challengeDeposit: CollateralData
  resolver: string
  rules: string
}

export type RegistryEntryData = {
  id: string
  name: string
  executor: DaoData
  queue: GovernQueueData
}

export type QueryResult = OperationResult<any>

// Events

export type ContainerEvent =
  | ContainerEventChallenge
  | ContainerEventExecute
  | ContainerEventResolve
  | ContainerEventRule
  | ContainerEventSchedule
  | ContainerEventSubmitEvidence
  | ContainerEventVeto

export type ContainerEventChallenge = {
  id: string
  container: ContainerData
  createdAt: BigInt
  actor: string
  collateral: CollateralData
  disputeId: BigInt
  reason: string
  resolver: string
}

export type ContainerEventExecute = {
  id: string
  container: ContainerData
  createdAt: BigInt
  execResults: string[]
}

export type ContainerEventResolve = {
  id: string
  container: ContainerData
  createdAt: BigInt
  approved: boolean
}

export type ContainerEventRule = {
  id: string
  container: ContainerData
  createdAt: BigInt
  ruling: BigInt
}

export type ContainerEventSchedule = {
  id: string
  container: ContainerData
  createdAt: BigInt
  collateral: CollateralData
}

export type ContainerEventSubmitEvidence = {
  id: string
  container: ContainerData
  createdAt: BigInt
  evidence: string
  submitter: string
  finished: boolean
}

export type ContainerEventVeto = {
  id: string
  container: ContainerData
  createdAt: BigInt
  reason: string
}
