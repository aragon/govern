import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import optimisticGame from './optimisticGame'
import collateral, { Collateral } from './collateral'
import item, { Item } from './item'
import challenge, { Challenge } from './challenge'
import execution, { Execution } from './execution'
import role, { Role } from './role'
import { Address } from '../../lib/types/Address'

export interface Veto {
  id: string
  item: Item
  reason: string
  submitter: Address
  collateral: Collateral
  createdAt: string
}

export interface OptimisticQueue {
  id: string
  address: Address
  config: {
    id: string
    executionDelay: string
    scheduleDeposit: Collateral
    challengeDeposit: Collateral
    vetoDeposit: Collateral
    resolver: Address
    rules: string
  }
  queue: Item[]
  executions: Execution[]
  challenges: Challenge[]
  vetos: Veto[]
  roles: Role[]
}

const optimisticQueue: DocumentNode = gql`
    fragment OptimisticQueue_optimisticQueue on OptimisticQueue {
      id
      address
      config {
        id
        executionDelay
        scheduleDeposit {
          ...Collateral_collateral
        }
        challengeDeposit {
          ...Collateral_collateral
        }
        vetoDeposit {
          ...Collateral_collateral
        }
        resolver
        rules
      }
      queue {
        ...Item_item
      }
      executions {
        ...Execution_execution
      }
      challenges {
        ...Challenge_challenge
      }
      vetos {
        id
        item {
          ...Item_item
        }
        reason
        submitter
        collateral {
          ...Collateral_collateral
        }
        createdAt
      }
      roles {
        ...Role_role
      }
    }
    ${collateral}
    ${optimisticGame}
    ${item}
    ${execution}
    ${challenge}
    ${role}
  `

export default optimisticQueue
