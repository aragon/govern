import configuration from './configuration'
import QueuesAction from '../internal/actions/QueuesAction'

/**
 * TODO: Define return type in promise
 *
 * @returns {Promise<any>}
 */
export default function queues(): Promise<any> {
  return new QueuesAction(configuration.global).execute();
}
