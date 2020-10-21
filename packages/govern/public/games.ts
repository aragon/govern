import configuration from './configuration'
import GamesAction from '../internal/actions/GamesAction'

/**
 * TODO: Define return type in promise
 *
 * @returns {Promise<any>}
 */
export default function game(): Promise<any> {
  return new GamesAction(configuration.global).execute()
}
