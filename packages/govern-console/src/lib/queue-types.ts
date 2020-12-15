export type Collateral = {
  token: string
  amount: string
}

export type Config = {
  executionDelay: string
  scheduleDeposit: Collateral
  challengeDeposit: Collateral
  resolver: string
  rules: string
}

export type Action = {
  to: string
  value: string
  data: string
}

export type Payload = {
  id?: string
  nonce: string
  executionTime: string
  submitter: string
  executor: any
  actions: Action[]
  allowFailuresMap: string
  proof: string
}

export type ContainerEventChallenge = {
  id: string
  container: any
  createdAt: string
  actor: string
  collateral: Collateral
  disputeId: string
  reason: string
  resolver: string
}

export type ContainerEventExecute = {
  id: string
  container: any
  createdAt: string
  execResults: string[]
}

export type ContainerEventResolve = {
  id: string
  container: any
  createdAt: string
  approved: boolean
}

export type ContainerEventRule = {
  id: string
  container: any
  createdAt: string
  ruling: string
}

export type ContainerEventSchedule = {
  id: string
  container: any
  createdAt: string
  collateral: Collateral
}

export type ContainerEventSubmitEvidence = {
  id: string
  container: any
  createdAt: string
  evidence: string
  submitter: string
  finished: boolean
}

export type ContainerEventVeto = {
  id: string
  container: any
  created: string
  reason: string
}

export type ContainerEvent =
  | ContainerEventChallenge
  | ContainerEventExecute
  | ContainerEventResolve
  | ContainerEventRule
  | ContainerEventSchedule
  | ContainerEventSubmitEvidence
  | ContainerEventVeto

export type Container = {
  id?: string
  queue?: string
  state?: string
  config: Config
  payload: Payload
  history?: ContainerEvent[]
}
