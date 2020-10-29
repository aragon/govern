import { Address } from '../../lib/types/Address'

export interface Role {
  id: string
  entitiy: Address
  selector: string
  who: Address
  granted: boolean
  frozen: boolean
}

const role: string = `
    fragment Role_role on Role {
      id
      entity
      selector
      who
      granted
      frozen
    }
  `

export default role
