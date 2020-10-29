import action, { Action } from './action'
import { Address } from '../../lib/types/Address'

export interface Execution {
  id: string
  sender: Address
  actions: Action[]
  results: string[]
}

const execution: string = `
    fragment Execution_execution on Execution {
      id
      sender
      actions {
        ...Action_action
      }
      results
    }
    ${action}
  `

export default execution
