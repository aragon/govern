import { DocumentNode } from 'graphql'
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
  protected gqlQuery: DocumentNode = dao

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
