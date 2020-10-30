# GraphQL API

Govern Server is exposing a GraphQL API that lets you fetch data related to your Govern DAOs. Here is the complete list of queries and types that are available.

## Queries

### `dao(name: String!): Dao`

Use this query to get a single DAO, using its name. See the `Dao` type to know more information.

### `daos: [Dao]`

Use this query to get the list of DAOs.

## Types

### GovernRegistry

Represents the DAO registry. It contains `entries`, which have a name and contain a `queue` and an `executor`. A DAO is identified by its name.

```gql
type GovernRegistry {
  id: ID!
  address: String!
  count: Int!
  entries: [RegistryEntry!]!
}
```

### RegistryEntry

A single registry entry. It has a `name`, a `queue` and an `executor`. A DAO is identified by its name.

```gql
type RegistryEntry {
  id: ID!
  name: String!
  queue: GovernQueue!
  executor: Dao!
}
```

### Dao

A single DAO entry.

```gql
type Dao {
  id: ID!
  address: String!
  metadata: String
  registryEntries: [RegistryEntry!]!
  containers: [Container]!
  roles: [Role!]!
  queues: [GovernQueue]!
}
```

### GovernQueue

Represents an queue of scheduled actions (`Container`) and a configuration.

```gql
type GovernQueue {
  id: ID!
  address: String!
  config: Config!
  registryEntries: [RegistryEntry!]!
  queued: [Container!]!
  roles: [Role!]!
}
```

### Config

The configuration of a `GovernQueue`.

```gql
type Config {
  id: ID!
  queue: GovernQueue!
  executionDelay: String!
  scheduleDeposit: Collateral!
  challengeDeposit: Collateral!
  resolver: String!
  rules: String!
}
```

### Container

A `Container` represents an action being scheduled for execution, inside a `GovernQueue`. It also contains the configuration at the time it was scheduled, and a history of past events.

```gql
type Container {
  id: ID!
  queue: GovernQueue!
  state: ContainerState!
  config: Config!
  payload: ContainerPayload!
  history: [ContainerEvent!]!
}
```

### ContainerState

The different states of a `Container`.

```gql
enum ContainerState {
  None
  Scheduled
  Approved
  Challenged
  Rejected
  Cancelled
  Executed
}
```

### ContainerPayload

A list of actual actions attached to a `Container`.

```gql
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
```

### Action

Represents an independent action (transaction data) in a `ContainerPayload`.

```gql
type Action {
  id: ID!
  payload: ContainerPayload!
  to: String!
  value: String!
  data: String!
}
```

### Collateral

Represents a collateral that gets attached to a `Container` when scheduling it and challenging it.

Scenario 1:

- Bob submits an action to be executed, with a collateral attached to it.
- The action passes and doesn’t get challenged.
- The action gets executed and Bob receives its collateral back.

Scenario 2:

- Bob submits an action to be executed, with a collateral attached to it.
- The action passes but gets challenged by Alice, with a collateral attached.
- The arbitrator approves the action. Bob Receives both collaterals.

Scenario 3:

- Bob submits an action to be executed, with a collateral attached to it.
- The action passes but gets challenged by Alice, with a collateral attached.
- The arbitrator rejects the action. Alice Receives both collaterals.

```gql
type Collateral {
  id: ID!
  token: String!
  amount: String!
}
```

### Role

The roles defined on a given `GovernQueue`.

```gql
type Role {
  id: ID!
  entity: String!
  selector: String!
  who: String!
  granted: Boolean!
  frozen: Boolean!
}
```

### ContainerEventChallenge

A `Container` event representing an action being challenged.

```gql
type ContainerEventChallenge {
  id: ID!
  container: Container!
  createdAt: String!
  actor: String!
  collateral: Collateral!
  disputeId: String!
  reason: String!
  resolver: String!
}
```

### ContainerEventExecute

A `Container` event representing an action being executed.

```gql
type ContainerEventExecute {
  id: ID!
  container: Container!
  createdAt: String!
  execResults: [String!]!
}
```

### ContainerEventResolve

A `Container` event representing an action being resolved.

```gql
type ContainerEventResolve {
  id: ID!
  container: Container!
  createdAt: String!
  approved: Boolean!
}
```

### ContainerEventRule

A `Container` event representing an action being ruled.

```gql
type ContainerEventRule {
  id: ID!
  container: Container!
  createdAt: String!
  ruling: String!
}
```

### ContainerEventSchedule

A `Container` event representing an action being scheduled.

```gql
type ContainerEventSchedule {
  id: ID!
  container: Container!
  createdAt: String!
  collateral: Collateral!
}
```

### ContainerEventSubmitEvidence

A `Container` event representing an evidence being submitted.

```gql
type ContainerEventSubmitEvidence {
  id: ID!
  container: Container!
  createdAt: String!
  evidence: String!
  submitter: String!
  finished: Boolean!
}
```

### ContainerEventVeto

A `Container` event representing an action being vetoed by the arbitrator.

```gql
type ContainerEventVeto {
  id: ID!
  container: Container!
  createdAt: String!
  reason: String!
}
```
