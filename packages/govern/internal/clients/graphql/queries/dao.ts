import optimisticQueue, { OptimisticQueue } from '../fragments/optimisticQueue'
import execution, { Execution } from '../fragments/execution'
import role, { Role } from '../fragments/role'
import { Address } from '../../lib/types/Address'

export interface Dao {
  id: string
  address: Address
  executons: Execution[]
  roles: Role[]
  queues: OptimisticQueue[]
}

const dao: string = `
    query DAO($address: String) {
      dao(address: $address) {
        id
        address
        executions {
          ...Execution_execution
        }
        roles {
          ...Role_role
        }
        queues {
          ...OptimisticQueue_optimisticQueue
        }
      }
    }
    ${optimisticQueue}
    ${execution}
    ${role}
  `

export default dao
