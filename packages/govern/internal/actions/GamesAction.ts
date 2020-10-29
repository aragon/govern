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
  protected gqlQuery: string = games


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
