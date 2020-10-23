import QueueAction from '../internal/actions/QueueAction'
import Configuration from '../internal/configuration/Configuration'

/**
 * TODO: Define return type in promise
 *
 * @param {string} id
 *
 * @returns {Promise<any>}
 */
export default function queue(id: string): Promise<any> {
  return new QueueAction(Configuration.get(), { id: id}).execute()
}
