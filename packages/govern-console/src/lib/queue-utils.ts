import { toHex } from 'web3-utils'
import { Action, Config, Container } from './queue-types'

const EMPTY_FAILURE_MAP =
  '0x0000000000000000000000000000000000000000000000000000000000000000'
const EMPTY_BYTES = '0x00'

export function marshallContainer(
  account: string,
  actions: Action[],
  config: Config,
  executorAddress: string,
  executionTime: string,
  nonce: string,
  proof: string,
): Container {
  return {
    payload: {
      nonce,
      executionTime,
      submitter: account,
      executor: executorAddress,
      actions,
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
}
