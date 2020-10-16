import gql from 'graphql-tag'

export const ACTION_FRAGMENT = gql`
  fragment Action_action on Action {
    id
    to
    value
    data
    item {
      id
    }
    execution {
      id
    }
  }
`

export const EXECUTION_FRAGMENT = gql`
  fragment Execution_execution on Execution {
    id
    sender
    queue {
      id
    }
    actions {
      ...Action_action
    }
    results
  }
  ${ACTION_FRAGMENT}
`

export const COLLATERAL_FRAGMENT = gql`
  fragment Collateral_collateral on Collateral {
    id
    token {
      id
    }
    amount
  }
`

export const ITEM_FRAGMENT = gql`
  fragment Execution_execution on Execution {
    id
    status
    nonce
    executionTime
    submitter
    executor {
      id
    }
    actions {
      ...Action_action
    }
    proof
    collateral {
      ...Collateral_collateral
    }
    createdAt
  }
  ${ACTION_FRAGMENT}
  ${COLLATERAL_FRAGMENT}
`

export const ROLE_FRAGMENT = gql`
  fragment Role_role on Role {
    id
    entity
    selector
    who
    granted
    frozen
  }
`

export const GOVERN_FRAGMENT = gql`
  fragment Govern_govern on Govern {
    id
    address
    metadata
    games {
      id
    }
    executions {
      ...Execution_execution
    }
    roles {
      ...Role_role
    }
  }
  ${ROLE_FRAGMENT}
  ${EXECUTION_FRAGMENT}
`

export const QUEUE_FRAGMENT = gql`
  fragment Govern_govern on OptimisticQueue {
    id
    address
    config{
      
    }
    games{
      id
    }
    queue{
      ...Items_items
    }
    executions {
      ...Execution_execution
    }
    roles {
      ...Role_role
    }
  }
  ${ROLE_FRAGMENT}
  ${EXECUTION_FRAGMENT}
`

export const GAME_FRAGMENT = gql`
  fragment Game_game on OptimisticGame {
    id
    name
    executor {
      ...Govern_govern
    }
    queue {
      ...Queue_queue
    }
  }
  ${GOVERN_FRAGMENT}
  ${QUEUE_FRAGMENT}
`
