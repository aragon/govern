import { OptimisticQueue } from 'internal/clients/graphql/fragments/optimisticQueue'
import { Address } from 'internal/clients/lib/types/Address'
import QueuesForDaoAction  from 'internal/actions/QueuesForDaoAction'

/**
 * Returns all queues of a Dao.
 *
 * @param {Address} address
 *
 * @returns {Promise<OptimisticQueue>}
 */
export default function queuesForDao(address: Address): Promise<OptimisticQueue[]> {
  return new QueuesForDaoAction({ address: address }).execute()
}
