import { gql } from 'apollo-server'

export default gql`
  type GovernRegistry {
    id: ID!
    address: String!
    count: Int!
    entries: [RegistryEntry!]!
  }

  type RegistryEntry {
    id: ID!
    name: String!
    queue: GovernQueue!
    executor: Dao!
  }

  type Dao {
    id: ID!
    address: String!
    metadata: String
    registryEntries: [RegistryEntry!]!
    containers: [Container]!
    roles: [Role!]!
    queues: [GovernQueue]!
  }

  type GovernQueue {
    id: ID!
    address: String!
    config: Config!
    registryEntries: [RegistryEntry!]!
    queued: [Container!]!
    roles: [Role!]!
  }

  type Config {
    id: ID!
    queue: GovernQueue!
    executionDelay: String!
    scheduleDeposit: Collateral!
    challengeDeposit: Collateral!
    resolver: String!
    rules: String!
  }

  type Container {
    id: ID!
    queue: GovernQueue!
    state: ContainerState!
    config: Config!
    payload: ContainerPayload!
    history: [ContainerEvent!]!
  }

  type ContainerPayload {
    id: ID!
    container: Container!
    nonce: String!
    executionTime: String!
    submitter: String!
    executor: Dao!
    actions: [Action!]!
    allowFailuresMap: String!
    proof: String!
  }

  type Collateral {
    id: ID!
    token: String!
    amount: String!
  }

  type Action {
    id: ID!
    payload: ContainerPayload!
    to: String!
    value: String!
    data: String!
  }

  type Role {
    id: ID!
    entity: String!
    selector: String!
    who: String!
    granted: Boolean!
    frozen: Boolean!
  }

  enum ContainerState {
    None
    Scheduled
    Approved
    Challenged
    Rejected
    Cancelled
    Executed
  }

  # Container events

  interface ContainerEvent {
    id: ID!
    container: Container!
    createdAt: String!
  }

  type ContainerEventChallenge implements ContainerEvent {
    id: ID!
    container: Container!
    createdAt: String!
    actor: String!
    collateral: Collateral!
    disputeId: String!
    reason: String!
    resolver: String!
  }

  type ContainerEventExecute implements ContainerEvent {
    id: ID!
    container: Container!
    createdAt: String!
    execResults: [String!]!
  }

  type ContainerEventResolve implements ContainerEvent {
    id: ID!
    container: Container!
    createdAt: String!
    approved: Boolean!
  }

  type ContainerEventRule implements ContainerEvent {
    id: ID!
    container: Container!
    createdAt: String!
    ruling: String!
  }

  type ContainerEventSchedule implements ContainerEvent {
    id: ID!
    container: Container!
    createdAt: String!
    collateral: Collateral!
  }

  type ContainerEventSubmitEvidence implements ContainerEvent {
    id: ID!
    container: Container!
    createdAt: String!
    evidence: String!
    submitter: String!
    finished: Boolean!
  }

  type ContainerEventVeto implements ContainerEvent {
    id: ID!
    container: Container!
    createdAt: String!
    reason: String!
  }

  type Query {
    daos: [Dao!]!
    dao(address: String!): Dao
    registryEntry(name: String!): RegistryEntry
    registryEntries: [RegistryEntry!]
  }
`
