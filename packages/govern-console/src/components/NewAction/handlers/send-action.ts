import BN from 'bn.js'
import { Contract as EthersContract, ContractTransaction } from 'ethers'
import abiCoder from 'web3-eth-abi'
import { toHex } from 'web3-utils'

const EMPTY_BYTES = '0x00'
const EMPTY_FAILURE_MAP =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

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

export default async function sendAction(
  account: string,
  config: any,
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
  const currentDate =
    Math.ceil(Date.now() / 1000) + Number(config.executionDelay) + 60
  const container = {
    payload: {
      nonce: newNonce.toString(),
      executionTime: currentDate,
      submitter: account,
      executor: executorAddress,
      actions: [
        {
          to: targetContractAddress,
          value: EMPTY_BYTES,
          data: encodedFunctionCall,
        },
      ],
      allowFailuresMap: EMPTY_FAILURE_MAP,
      proof: proof ? toHex(proof) : EMPTY_BYTES,
    },
    config: {
      executionDelay: config.executionDelay,
      scheduleDeposit: {
        token: config.scheduleDeposit.token,
        amount: config.scheduleDeposit.amount,
      },
      challengeDeposit: {
        token: config.challengeDeposit.token,
        amount: config.challengeDeposit.amount,
      },
      resolver: config.resolver,
      rules: config.rules,
    },
  }

  const tx = await queueContract.schedule(container, {
    gasLimit: 500000,
  })

  return tx
}
