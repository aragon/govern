import BN from 'bn.js'
import { Contract as EthersContract, ContractTransaction } from 'ethers'
import abiCoder from 'web3-eth-abi'
import { toHex } from 'web3-utils'

const EMPTY_BYTES = '0x00'
const EMPTY_FAILURE_MAP =
  '0x0000000000000000000000000000000000000000000000000000000000000000'
const NO_TOKEN = `${'0x'.padEnd(42, '0')}`

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
  ercContract: EthersContract | null,
  executorAddress: string,
  proof: string,
  rawFunctionAbi: AbiType,
  rawFunctionArguments: InputStateData[],
  targetContractAddress: string,
  queueAddress: string,
  queueContract: EthersContract,
): Promise<ContractTransaction> {
  // First, let's handle token approvals (if a token has been configured).
  // There are 3 cases to check
  // 1. The user has more allowance than needed, we can skip. (0 tx)
  // 2. The user has less allowance than needed, and we need to raise it. (2 tx)
  // 3. The user has 0 allowance, we just need to approve the needed amount. (1 tx)
  if (config.scheduleDeposit.token !== NO_TOKEN && ercContract) {
    const allowance = await ercContract.allowance(account, queueAddress)
    if (
      allowance.lt(config.scheduleDeposit.amount) &&
      config.scheduleDeposit.token !== NO_TOKEN
    ) {
      if (!allowance.isZero()) {
        const resetTx = await ercContract.approve(account, '0')
        await resetTx.wait(1)
      }
      await ercContract.approve(queueAddress, config.scheduleDeposit.amount)
    }
  }

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
