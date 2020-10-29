import collateral, { Collateral } from './collateral'
import item, { Item } from './item'
import { Address } from '../../lib/types/Address'

export interface Challenge {
  id: string
  challenger: Address
  item: Item
  arbitrator: Address
  disputeId: string
  evidences: {
    id: string
    data: string
    submitter: Address
    createdAt: string
  }
  collateral: Collateral
  ruling: string
  approved: boolean
  createdAt: string
}

const challenge: string = `
    fragment Challenge_challenge on Challenge {
      id
      challenger
      item {
        ...Item_item
      }
      arbitrator
      disputeId
      evidences {
        id
        data
        submitter
        createdAt
      }
      collateral {
        ...Collateral_collateral
      }
      ruling
      approved
      createdAt
    }
    ${collateral}
    ${item}
  `

export default challenge
