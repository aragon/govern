import { getConfiguration } from './configure'
import QueueAction from '../internal/actions/QueueAction'

/**
 * TODO: Define return type in promise
 *
 * @param {string} address
 *
 * @returns {Promise<any>}
 */
export default function queue(address: string): Promise<any> {
  return new QueueAction(getConfiguration(), {address: address}).execute();
}
