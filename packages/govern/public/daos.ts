import { Daos } from '../internal/clients/graphql/queries/daos'
import DaosAction from '../internal/actions/DAOSAction'

export { Daos }

/**
 * Returns all known Dao objects
 *
 * @returns {Promise<Daos>}
 */
export function daos(): Promise<Daos> {
  return new DaosAction().execute()
}
