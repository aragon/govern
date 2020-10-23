import { isAddress } from '@ethersproject/address'
import DAOAction from '../internal/actions/DAOAction'

/**
 * TODO: Define return type in promise
 *
 * @param {string} address
 *
 * @returns {Promise<any>}
 */
export default function dao(address: string): Promise<any> {
  if (!isAddress(address)) {
    throw new Error('Invalid Ethereum address passed!')
  }

  return new DAOAction({ address: address }).execute()
}
