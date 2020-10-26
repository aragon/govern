import { Address } from 'govern-server/src/core/types'
import { Dao } from '../internal/clients/graphql/queries/dao'
import DaoAction  from '../internal/actions/DAOAction'

/**
 * Returns a Dao object by the given name.
 *
 * @param {Address} address
 *
 * @returns {Promise<Dao>}
 */
export default function dao(address: Address): Promise<Dao> {
  return new DaoAction({ address: address }).execute()
}
