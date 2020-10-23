import { DocumentNode } from 'graphql'
import AbstractAction from './lib/AbstractAction'
import dao from '../clients/graphql/queries/dao'

export default class DAOAction extends AbstractAction {
  protected gqlQuery: DocumentNode = dao;
}
