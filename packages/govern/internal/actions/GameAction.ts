import { DocumentNode } from 'graphql'
import AbstractAction from './lib/AbstractAction'
import game from '../clients/graphql/queries/game'

export default class GameAction extends AbstractAction {
  protected gqlQuery: DocumentNode = game
}
