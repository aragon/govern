import { gql } from 'apollo-server'

export default gql`
  type GovernRegistry {
    id: ID!
    address: String!
    count: Int!
    games: [OptimisticGame!]
  }

  type OptimisticGame {
    id: ID!
    name: String!
    executor: Dao!
    queue: OptimisticQueue!
    metadata: String
  }

  type Dao {
    id: ID!
    address: String!
    games: [OptimisticGame!]
    executions: [Execution!]
    roles: [Role!]
    queues: [OptimisticQueue!]
  }

  type Execution {
    id: ID!
    sender: String!
    actions: [Action!]
    results: [String!]
  }

  type Action {
    id: ID!
    to: String!
    value: String!
    data: String!
    item: Item!
    execution: Execution
  }

  type OptimisticQueue {
    id: ID!
    address: String!
    config: Config
    games: [OptimisticGame!]
    queue: [Item!]
    executions: [Execution!]
    challenges: [Challenge!]
    vetos: [Veto!]
    roles: [Role!]
  }

  type Config {
    id: ID!
    queue: OptimisticQueue!
    executionDelay: String!
    scheduleDeposit: Collateral!
    challengeDeposit: Collateral!
    vetoDeposit: Collateral!
    resolver: String!
    rules: String!
  }

  type Collateral {
    id: ID!
    token: String!
    amount: String!
  }

  type Item {
    id: ID!
    status: ItemStatus!
    nonce: String!
    executionTime: String!
    submitter: String!
    executor: Dao!
    actions: [Action!]
    proof: String!
    collateral: Collateral!
    createdAt: String!
  }

  type Challenge {
    id: ID!
    queue: OptimisticQueue!
    challenger: String!
    item: Item!
    arbitrator: String!
    disputeId: String!
    evidences: [Evidence!]
    collateral: Collateral!
    ruling: String
    approved: Boolean
    createdAt: String!
  }

  type Evidence {
    id: ID!
    challenge: Challenge!
    data: String!
    submitter: String!
    createdAt: String!
  }

  type Veto {
    id: ID!
    queue: OptimisticQueue!
    item: Item!
    reason: String!
    submitter: String!
    collateral: Collateral!
    createdAt: String!
  }

  type Role {
    id: ID!
    entity: String!
    selector: String!
    who: String!
    granted: Boolean!
    frozen: Boolean!
  }

  enum ItemStatus {
    None
    Approved
    Cancelled
    Challenged
    Executed
    Rejected
    Scheduled
    Vetoed
  }

  type Query {
    daos: [Dao!]!
    dao(address: String!): Dao
    game(name: String!): OptimisticGame
    games: [OptimisticGame!]
  }
`
