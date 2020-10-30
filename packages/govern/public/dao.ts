import { Dao } from '../internal/clients/graphql/queries/dao'
import DaoAction  from '../internal/actions/DAOAction'

/**
 * Returns a Dao object by the given name.
 *
 * @param {string} name
 *
 * @returns {Promise<Dao>}
 */
export function dao(name: string): Promise<Dao> {
  return new DaoAction({ name: name }).execute()
}
