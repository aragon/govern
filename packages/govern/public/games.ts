import { isAddress } from '@ethersproject/address'
import GamesAction from '../internal/actions/GamesAction'

/**
 * TODO: Define return type in promise
 *
 * @param {string} address
 *
 * @returns {Promise<any>}
 */
export default function games(address: string): Promise<any> {
  if (!isAddress(address)) {
    throw new Error('Invalid Ethereum address passed!')
  }

  return new GamesAction({address: address}).execute()
}
