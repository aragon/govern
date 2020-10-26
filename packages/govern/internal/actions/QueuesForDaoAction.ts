import { isAddress } from '@ethersproject/address'
import { Address } from 'govern-server/src/core/types'
import { OptimisticQueue } from '../clients/graphql/fragments/optimisticQueue'
import { DocumentNode } from 'graphql'
import AbstractAction from './lib/AbstractAction'
import queuesForDAO  from '../clients/graphql/queries/queuesForDAO'

/**
 * @class QueuesForDaoAction
 */
export default class QueuesForDaoAction extends AbstractAction<OptimisticQueue[]> {
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
  constructor(parameters: { address: Address }) {
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
  protected validateParameters(parameters?: any): { address: Address } {
    if (!isAddress(parameters.address)) {
      throw new Error('Invalid Ethereum address passed!')
    }

    return super.validateParameters(parameters)
  }
}
