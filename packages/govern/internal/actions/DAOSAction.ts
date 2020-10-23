import { DocumentNode } from 'graphql'
import AbstractAction from './lib/AbstractAction'
import daos from '../clients/graphql/queries/daos'

export default class DAOSAction extends AbstractAction {
  protected gqlQuery: DocumentNode = daos
}
