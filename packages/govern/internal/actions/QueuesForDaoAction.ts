import { isAddress } from '@ethersproject/address'
import { OptimisticQueue } from '../clients/graphql/fragments/optimisticQueue'
import { DocumentNode } from 'graphql'
import { Address } from '../clients/lib/types/Address'
import AbstractAction from './lib/AbstractAction'
import queuesForDAO  from '../clients/graphql/queries/queuesForDAO'

/**
 * @class QueuesForDaoAction
 */
export default class QueuesForDaoAction extends AbstractAction<OptimisticQueue[]> {
  /**
   * Contains the GraphQL query of the current action
   *
   * @var {DocumentNode} gqlQuery
   *
   * @protected
   */
  protected gqlQuery: DocumentNode = queuesForDAO

  /**
   * @param {{address: Address}} parameters
   *
   * @constructor
   */
  constructor(parameters: { address: Address }) {
    super(parameters)
  }

  /**
   * Validates the given parameters
   *
   * @param {{address: Address}} parameters
   *
   * @method validateParameters
   *
   * @protected
   */
  protected validateParameters(parameters: {address: Address}): { address: Address } {
    if (!isAddress(parameters.address)) {
      throw new Error('Invalid Ethereum address passed!')
    }

    return super.validateParameters(parameters)
  }
}
