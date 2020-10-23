import QueuesForDaoAction from '../internal/actions/QueuesForDaoAction'
import Configuration from '../internal/configuration/Configuration'

/**
 * TODO: Define return type in promise
 *
 * @param {string} address
 *
 * @returns {Promise<any>}
 */
export default function queuesForDao(address: string): Promise<any> {
  return new QueuesForDaoAction(Configuration.get(), { address: address }).execute()
}
