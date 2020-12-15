import { Contract as EthersContract } from 'ethers'
import { Input } from '../../../lib/abi-types'

interface InputStateData extends Input {
  value: string
}
export default async function callContractFunction(
  functionName: string,
  rawFunctionArguments: InputStateData[],
  targetContract: EthersContract,
): Promise<string> {
  const args = rawFunctionArguments.map((value: InputStateData) => value.value)

  const callResponse = args
    ? await targetContract[functionName](...args)
    : await targetContract[functionName]()

  return callResponse.toString()
}
