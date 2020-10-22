import { getConfiguration } from './configure'
import DAOAction from '../internal/actions/DAOAction'

/**
 * TODO: Define return type in promise
 *
 * @param {string} address
 *
 * @returns {Promise<any>}
 */
export default function dao(address: string): Promise<any> {
  return new DAOAction(getConfiguration(), { address: address }).execute()
}
