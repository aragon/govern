import { DocumentNode } from 'graphql'
import AbstractAction from './lib/AbstractAction'
import queue from '../clients/graphql/queries/queue'

export default class QueueAction extends AbstractAction {
  protected gqlQuery: DocumentNode = queue
}
