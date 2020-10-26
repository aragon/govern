import { OptimisticGame } from '../internal/clients/graphql/fragments/optimisticGame'
import { Address } from '../internal/clients/lib/types/Address'
import GamesAction from '../internal/actions/GamesAction'

/**
 * Returns all games by the given Dao address
 *
 * @param {Address} address
 *
 * @returns {Promise<OptimisticGame[]>}
 */
export default function games(address: Address): Promise<OptimisticGame[]> {
  return new GamesAction({ address: address }).execute()
}
