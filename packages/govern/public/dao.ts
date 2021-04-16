import { Dao } from '../internal/clients/graphql/fragments/dao-entry'
import DaoAction from '../internal/actions/DaoAction'

export { Dao }

/**
 * Returns a Dao object by the given name.
 *
 * @param {string} name
 *
 * @returns {Promise<Dao|null>}
 */
export function dao(name: string): Promise<Dao|null> {
  return new DaoAction({ name: name }).execute()
}
