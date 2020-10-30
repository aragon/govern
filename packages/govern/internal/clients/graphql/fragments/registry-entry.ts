export type Collateral = {
  id: string
  token: string
  amount: string
}

export type ContainerEventChallenge = {
  id: string
  createdAt: string
  actor: string
  collateral: Collateral
  disputeId: string
  reason: string
  resolver: string
}

export type ContainerEventExecute = {
  id: string
  createdAt: string
  execResults: string[]
}

export type ContainerEventResolve = {
  id: string
  createdAt: string
  approved: boolean
}

export type ContainerEventRule = {
  id: string
  createdAt: string
  ruling: string
}

export type ContainerEventSchedule = {
  id: string
  createdAt: string
  collateral: Collateral
}

export type ContainerEventSubmitEvidence = {
  id: string
  createdAt: string
  evidence: string
  submitter: string
  finished: boolean
}

export type ContainerEventVeto = {
  id: string
  createdAt: string
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

export interface Action {
  id: string,
  to: string,
  value: string,
  data: string
}

export interface RegistryEntry {
  id: string,
  name: string,
  queue: {
    id: string,
    address: string,
    config: {
      executionDelay: string
      scheduleDeposit: Collateral,
      challengeDeposit: Collateral,
      resovler: string,
      rules: string
    },
    queued: {
      id: string,
      state: string,
      payload: {
        id: string,
        nonce: string,
        executionTime: string,
        submitter: string,
        actions: Action[]
        allowFailuresMap: string,
        proof: string
      },
      history: ContainerEvent[]
    }
  }
}

const registryEntry = `
  fragment RegistryEntry_registryEntry on RegistryEntry {
    id
    name
    queue {
        id
        address
        config {
            executionDelay
            scheduleDeposit {
                id
                token
                amount
            }
            challengeDeposit {
                id
                token
                amount
            }
            resolver 
            rules
        }
        queued {
            id
            state
            payload {
                id
                nonce
                executionTime
                submitter
                actions {
                    id
                    to
                    value
                    data
                }
                allowFailuresMap
                proof
            }
            history {
                id
            }
        }
    }
  }
`

export default registryEntry;
