import QueueAction from '../internal/actions/QueueAction'

/**
 * TODO: Define return type in promise
 *
 * @param {string} id
 *
 * @returns {Promise<any>}
 */
export default function queue(id: string): Promise<any> {
  return new QueueAction( { id: id}).execute()
}
