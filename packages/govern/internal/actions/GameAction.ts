import { DocumentNode } from 'graphql'
import AbstractAction from './lib/AbstractAction'
import game from '../clients/graphql/queries/game'

/**
 * @class GameAction
 */
export default class GameAction extends AbstractAction {
  /**
   * Contains the GraphQL query of the current action
   *
   * @var {string} gqlQuery
   *
   * @protected
   */
  protected gqlQuery: DocumentNode = game
}
