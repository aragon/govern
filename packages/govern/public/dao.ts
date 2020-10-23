import DAOAction from '../internal/actions/DAOAction'
import Configuration from '../internal/configuration/Configuration'

/**
 * TODO: Define return type in promise
 *
 * @param {string} address
 *
 * @returns {Promise<any>}
 */
export default function dao(address: string): Promise<any> {
  return new DAOAction(Configuration.get(), { address: address }).execute()
}
