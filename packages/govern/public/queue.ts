import { OptimisticQueue } from '../internal/clients/graphql/fragments/optimisticQueue'
import QueueAction  from '../internal/actions/QueueAction'

/**
 * Returns the OptimisticQueue object by the given ID.
 *
 * @param {string} id
 *
 * @returns {Promise<OptimisticQueue>}
 */
export function queue(id: string): Promise<OptimisticQueue> {
  return new QueueAction({ id: id }).execute()
}
