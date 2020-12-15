import BN from 'bn.js'
import { Contract as EthersContract, ContractTransaction } from 'ethers'
import abiCoder from 'web3-eth-abi'
import { marshallContainer } from '../../../lib/queue-utils'
import { Config } from '../../../lib/queue-types'
import { AbiType, Input } from '../../../lib/abi-types'

const EMPTY_BYTES = '0x00'

interface InputStateData extends Input {
  value: string
}

export default async function sendAction(
  account: string,
  config: Config,
  executorAddress: string,
  proof: string,
  rawFunctionAbi: AbiType,
  rawFunctionArguments: InputStateData[],
  targetContractAddress: string,
  queueContract: EthersContract,
): Promise<ContractTransaction> {
  const functionValues = rawFunctionArguments.map(
    (val: InputStateData) => val.value,
  )

  // @ts-ignore
  const encodedFunctionCall = abiCoder.encodeFunctionCall(
    rawFunctionAbi,
    functionValues,
  )

  const nonce = await queueContract.nonce()
  const bnNonce = new BN(nonce.toString())
  const newNonce = bnNonce.add(new BN('1'))

  // Current time + 30 secs buffer.
  // This is necessary for DAOs with lower execution delays, in which
  // the tx getting picked up by a later block can make the tx fail.
  const executionTime =
    Math.ceil(Date.now() / 1000) + Number(config.executionDelay) + 60
  const container = marshallContainer(
    account,
    [
      {
        to: targetContractAddress,
        value: EMPTY_BYTES,
        data: encodedFunctionCall,
      },
    ],
    config,
    executorAddress,
    executionTime.toString(),
    newNonce.toString(),
    proof,
  )

  const tx = await queueContract.schedule(container, {
    gasLimit: 500000,
  })

  return tx
}
