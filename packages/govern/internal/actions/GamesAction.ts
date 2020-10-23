import { DocumentNode } from 'graphql'
import AbstractAction from './lib/AbstractAction'
import games from '../clients/graphql/queries/games'

export default class GamesAction extends AbstractAction {
  protected gqlQuery: DocumentNode = games
}
