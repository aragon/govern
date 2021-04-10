export type Collateral = {
  id: string
  token: string
  amount: string
}

export type ContainerEventChallenge = {
  id: string
  createdAt: string
  challenger: string
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
  | ContainerEventVeto

export interface Action {
  id: string,
  to: string,
  value: string,
  data: string
}

type Role = {
  id: string,
  entity: string,
  selector: string,
  who: string,
  granted: boolean,
  frozen: boolean
}

type Config = {
  id: string,
  executionDelay: string
  scheduleDeposit: Collateral,
  challengeDeposit: Collateral,
  resolver: string,
  rules: string
}

type Executor = {
  id: string,
  address: string,
  metadata: string,
  balance: string,
  roles: Role[]
}

type Container = {
  id: string,
  state: string,
  config: Config,
  payload: {
    id: string,
    nonce: string,
    executionTime: string,
    submitter: string,
    executor: Executor,
    actions: Action[]
    allowFailuresMap: string,
    proof: string
  },
  history: ContainerEvent[]
}

export interface Dao {
  id: string,
  name: string,
  queue: {
    id: string,
    address: string,
    nonce: string,
    config: Config,
    containers: Container[]
  },
  executor: Executor,
  token: string,
  registrant: string
}

const daoEntry= `
  fragment daoEntry on Dao {
    id
    name
    queue {
        id
        address
        nonce
        config {
          id
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
        containers {
            id
            state
            config {
              id
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
            payload {
                id
                nonce
                executionTime
                submitter
                executor {
                  id
                  address
                  metadata
                  balance
                  roles {
                    id
                    entity
                    selector
                    who
                    granted
                    frozen
                  }
                }
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
                ... on ContainerEventChallenge {
                  id
                  createdAt
                  challenger
                  collateral {
                    id
                    token
                    amount
                  }
                  disputeId
                  reason
                  resolver
                }
                ... on ContainerEventExecute {
                  id
                  createdAt
                  execResults
                }
                ... on ContainerEventResolve {
                  id
                  createdAt
                  approved                  
                }
                ... on ContainerEventRule {
                  id
                  createdAt
                  ruling
                }
                ... on ContainerEventSchedule {
                  id
                  createdAt
                  collateral {
                    id
                    token
                    amount
                  }
                }
                ... on ContainerEventVeto {
                  id
                  createdAt
                  reason
                }
            }
        }
        roles {
          id
          entity
          selector
          who
          granted
          frozen
        }
    }
    executor {
      id
      address
      metadata
      balance
      roles {
        id
        entity
        selector
        who
        granted
        frozen
      }
    }
    token
    registrant
  }
`

export default daoEntry;
