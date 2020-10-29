import AbstractAction from './lib/AbstractAction'
import { OptimisticQueue } from '../clients/graphql/fragments/optimisticQueue'
import queue from '../clients/graphql/queries/queue'

/**
 * @class QueueAction
 */
export default class QueueAction extends AbstractAction<OptimisticQueue> {
  /**
   * Contains the GraphQL query of the current action
   *
   * @var {string} gqlQuery
   *
   * @protected
   */
  protected gqlQuery: string = queue
}
