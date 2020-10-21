import configuration from './configuration'
import GameAction from '../internal/actions/GameAction'

/**
 * TODO: Define return type in promise
 *
 * @param {string} name
 *
 * @returns {Promise<any>}
 */
export default function game(name: string): Promise<any> {
  return new GameAction(configuration.global, {name: name}).execute()
}
