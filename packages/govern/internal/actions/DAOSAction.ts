import { DocumentNode } from 'graphql'
import AbstractAction from './lib/AbstractAction'
import daos from '../clients/graphql/queries/daos'

/**
 * @class DAOSAction
 */
export default class DAOSAction extends AbstractAction {
  /**
   * Contains the GraphQL query of the current action
   *
   * @var {string} gqlQuery
   *
   * @protected
   */
  protected gqlQuery: DocumentNode = daos
}
