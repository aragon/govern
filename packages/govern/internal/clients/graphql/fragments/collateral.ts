export interface Collateral {
  id: string
  token: string
  amount: string
}

const collateral: string = `
    fragment Collateral_collateral on Collateral {
      id
      token
      amount
    }
  `

export default collateral
