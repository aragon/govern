import { Daos } from '../internal/clients/graphql/fragments/dao-entry'
import DaosAction from '../internal/actions/DaosAction'

export { Daos }

/**
 * Returns all known Dao objects
 *
 * @returns {Promise<Daos>}
 */
export function daos(): Promise<Daos> {
  return new DaosAction().execute()
}
