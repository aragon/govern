import { OptimisticGame } from '../internal/clients/graphql/fragments/optimisticGame'
import GameAction from '../internal/actions/GameAction'

/**
 * Returns the OptimisticGame by the given name
 *
 * @param {string} name
 *
 * @returns {Promise<OptimisticGame>}
 */
export default function game(name: string): Promise<OptimisticGame> {
  return new GameAction({ name: name }).execute()
}
