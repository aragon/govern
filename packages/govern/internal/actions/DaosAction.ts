import { DocumentNode } from 'graphql'
import AbstractAction from './lib/AbstractAction'
import daos, { Daos } from '../clients/graphql/queries/daos'

/**
 * @class DaosAction
 */
export default class DaosAction extends AbstractAction<Daos> {
  /**
   * Contains the GraphQL query of the current action
   *
   * @var {DocumentNode} gqlQuery
   *
   * @protected
   */
  protected gqlQuery: DocumentNode = daos
}
