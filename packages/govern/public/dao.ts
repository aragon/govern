import configuration from './configuration'
import DAOAction from '../internal/actions/DAOAction'

/**
 * TODO: Define return type in promise
 *
 * @param {string} address
 *
 * @returns {Promise<any>}
 */
export default function dao(address: string): Promise<any> {
  return new DAOAction(configuration.global, {address: address}).execute();
}
