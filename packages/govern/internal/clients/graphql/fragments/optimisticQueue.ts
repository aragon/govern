import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import optimisticGame from './optimisticGame'
import collateral from './collateral'
import item from './item'
import challenge from './challenge'
import execution from './execution'
import role from './role'

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
      games {
        ...OptimisticGame_optimisticGame
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
