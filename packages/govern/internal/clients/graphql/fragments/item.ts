import action, { Action } from './action'
import { Address } from '../../lib/types/Address'

export interface Item {
  id: string
  status: string
  nonce: string
  executionTime: string
  submitter: Address
  actions: Action[]
  proof: string
  createdAt: string
}

const item: string = `
    fragment Item_item on Item {
      id
      status
      nonce
      executionTime
      submitter
      actions {
        ...Action_action
      }
      proof
      createdAt
    }
    ${action}
  `

export default item
