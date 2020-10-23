import { DocumentNode } from 'graphql'
import AbstractAction from './lib/AbstractAction'
import queue from '../clients/graphql/queries/queue'

/**
 * @class QueueAction
 */
export default class QueueAction extends AbstractAction {
  /**
   * Contains the GraphQL query of the current action
   *
   * @var {string} gqlQuery
   *
   * @protected
   */
  protected gqlQuery: DocumentNode = queue
}
