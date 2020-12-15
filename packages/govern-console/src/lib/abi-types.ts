export type Input = {
  name: string
  type: string
}

export type AbiType = {
  name: string
  inputs: Input[]
  payable: string
  stateMutability: string
  type: string
}
