import { isAddress } from '@ethersproject/address'
import QueuesForDaoAction from '../internal/actions/QueuesForDaoAction'

/**
 * TODO: Define return type in promise
 *
 * @param {string} address
 *
 * @returns {Promise<any>}
 */
export default function queuesForDao(address: string): Promise<any> {
  if (!isAddress(address)) {
    throw new Error('Invalid Ethereum address passed!')
  }

  return new QueuesForDaoAction({ address: address }).execute()
}
