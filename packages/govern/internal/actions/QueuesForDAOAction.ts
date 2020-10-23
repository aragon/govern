import { DocumentNode } from 'graphql'
import AbstractAction from './lib/AbstractAction'
import queuesForDAO from '../clients/graphql/queries/queuesForDAO'

export default class QueuesForDAOAction extends AbstractAction {
  protected gqlQuery: DocumentNode = queuesForDAO
}
