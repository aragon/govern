import GamesAction from '../internal/actions/GamesAction'

/**
 * TODO: Define return type in promise
 *
 * @returns {Promise<any>}
 */
export default function games(): Promise<any> {
  return new GamesAction().execute()
}
