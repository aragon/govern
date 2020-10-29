import AbstractAction from './lib/AbstractAction'
import { isAddress } from '@ethersproject/address'
import { Address } from '../clients/lib/types/Address'
import dao, { Dao } from '../clients/graphql/queries/dao'

/**
 * @class DaoAction
 */
export default class DaoAction extends AbstractAction<Dao> {
  /**
   * Contains the GraphQL query of the current action
   *
   * @var {string} gqlQuery
   *
   * @protected
   */
  protected gqlQuery: string = dao

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
