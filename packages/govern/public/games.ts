import GamesAction from '../internal/actions/GamesAction'
import Configuration from '../internal/configuration/Configuration'

/**
 * TODO: Define return type in promise
 *
 * @returns {Promise<any>}
 */
export default function games(): Promise<any> {
  return new GamesAction(Configuration.get()).execute()
}
