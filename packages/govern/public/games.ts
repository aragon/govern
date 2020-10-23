import GamesAction from '../internal/actions/GamesAction'

/**
 * TODO: Define return type in promise
 *
 * @param {string} address
 *
 * @returns {Promise<any>}
 */
export default function games(address: string): Promise<any> {
  return new GamesAction({address: address}).execute()
}
