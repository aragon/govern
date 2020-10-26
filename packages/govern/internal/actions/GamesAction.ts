import { DocumentNode } from 'graphql'
import { OptimisticGame } from '../clients/graphql/fragments/optimisticGame'
import { isAddress } from '@ethersproject/address'
import { Address } from '../clients/lib/types/Address'
import AbstractAction from './lib/AbstractAction'
import games from '../clients/graphql/queries/games'

/**
 * @class GamesAction
 */
export default class GamesAction extends AbstractAction<OptimisticGame[]> {
  /**
   * Contains the GraphQL query of the current action
   *
   * @var {string} gqlQuery
   *
   * @protected
   */
  protected gqlQuery: DocumentNode = games


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
