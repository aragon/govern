import { OperationResult } from '@urql/core'

export type Address = string

export type Network = {
  name: string
  chainId: number
  ensAddress: Address
  subgraphId?: string
}

export type Networkish =
  | {
      chainId?: number
      ensAddress?: Address
      name?: string
      subgraphId?: string
    }
  | string
  | number

export enum ItemStatus {
  None,
  Approved,
  Cancelled,
  Challenged,
  Executed,
  Rejected,
  Scheduled,
  Vetoed,
}

export enum ContainerState {
  None,
  Scheduled,
  Approved,
  Challenged,
  Rejected,
  Cancelled,
  Executed,
}

export type ContainerData = {
  id: string
  queue: GovernQueueData
  state: ContainerState
  config: ConfigData
  payload: ContainerPayload
  history: ContainerEvent[]
}

export type ContainerPayload = {
  id: string
  container: ContainerData
  nonce: BigInt
  executionTime: BigInt
  submitter: string
  actions: ActionData[]
  allowFailuresMap: string
  proof: string
}

export type DaoData = {
  id: string
  address: Address
  containers: ContainerData[]
  metadata: string
  registryEntries: RegistryEntryData[]
  roles: RoleData[]
}

export type ExecutionData = {
  id: string
  sender: Address
  queue: { id: string }
  actions: ActionData[]
  results: string
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
  to: Address
  value: string
  data: string
  item: ItemData
  execution: ExecutionData
}

export type CollateralData = {
  id: string
  token: string
  amount: string
}

export type ItemData = {
  id: string
  status: ItemStatus
  nonce: string
  executionTime: string
  submitter: Address
  executor: DaoData
  actions: ActionData[]
  proof: string
  collateral: CollateralData
  createdAt: string
}

export type RegistryEntryData = {
  id: string
  name: string
  executor: DaoData
  queue: GovernQueueData
}

export type GovernQueueData = {
  id: string
  address: Address
  config: ConfigData
  games: RegistryEntryData
  queue: ItemData[]
  executions: ExecutionData[]
  challenges: ChallengeData[]
  vetos: VetoData[]
  roles: RoleData[]
}

export type ConfigData = {
  id: string
  queue: GovernQueueData
  executionDelay: string
  scheduleDeposit: CollateralData
  challengeDeposit: CollateralData
  vetoDeposit: CollateralData
  resolver: string
  rules: string
}

export type VetoData = {
  id: string
  queue: GovernQueueData
  item: ItemData
  reason: string
  submitter: Address
  collateral: CollateralData
  createdAt: string
}

export type ChallengeData = {
  id: string
  queue: GovernQueueData
  challenger: string
  item: ItemData
  arbitrator: string
  disputeId: string
  evidences: EvidenceData[]
  collateral: CollateralData
  ruling: string
  approved: boolean
  createdAt: string
}

export type EvidenceData = {
  id: string
  challenge: ChallengeData
  data: string
  submitter: Address
  createdAt: string
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
