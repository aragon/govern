import { Address } from '../../lib/types/Address'

export interface Action {
  id: string
  to: Address
  value: string
  data: string
}

const action: string = `
    fragment Action_action on Action {
      id
      to
      value
      data
    }
  `

export default action
