import { isAddress } from '@ethersproject/address'
import { DocumentNode } from 'graphql'
import AbstractAction from './lib/AbstractAction'
import queuesForDAO from '../clients/graphql/queries/queuesForDAO'

export default class QueuesForDAOAction extends AbstractAction {
  /**
   * Contains the GraphQL query of the current action
   *
   * @var {string} gqlQuery
   *
   * @protected
   */
  protected gqlQuery: DocumentNode = queuesForDAO

  /**
   * @param {Object} parameters
   *
   * @constructor
   */
  constructor(parameters: { address: string }) {
    super(parameters)
  }

  /**
   * Validates the given parameters
   *
   * @param {Object} parameters
   *
   * @method validateParameters
   *
   * @protected
   */
  protected validateParameters(parameters?: any): { address: string } {
    if (!isAddress(parameters.address)) {
      throw new Error('Invalid Ethereum address passed!')
    }

    return super.validateParameters(parameters)
  }
}
