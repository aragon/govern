import { Contract as EthersContract } from 'ethers'

type Input = {
  name: string
  type: string
}

type AbiType = {
  name: string
  inputs: Input[]
  payable: string
  stateMutability: string
  type: string
}

interface InputStateData extends Input {
  value: string
}
export default async function callContractFunction(
  functionName: string,
  rawFunctionArguments: InputStateData[],
  targetContract: EthersContract,
) {
  const args = rawFunctionArguments.map((value: InputStateData) => value.value)

  const callResponse = args
    ? await targetContract[functionName](...args)
    : await targetContract[functionName]()

  return callResponse.toString()
}
