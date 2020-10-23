import GameAction from '../internal/actions/GameAction'
import Configuration from '../internal/configuration/Configuration'

/**
 * TODO: Define return type in promise
 *
 * @param {string} name
 *
 * @returns {Promise<any>}
 */
export default function game(name: string): Promise<any> {
  return new GameAction(Configuration.get(), { name: name }).execute()
}
