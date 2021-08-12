import AbstractAction from './lib/AbstractAction'
import daos from '../clients/graphql/queries/daos'
import { Daos } from '../clients/graphql/fragments/dao-entry'

/**
 * @class DaosAction
 */
export default class DaosAction extends AbstractAction {
  /**
   * Contains the GraphQL query of the current action
   *
   * @var {string} gqlQuery
   *
   * @protected
   */
  protected gqlQuery: string = daos

  /**
   * Will execute the action and returns the response as expected.
   *
   * @method execute
   *
   * @returns {Promise<Daos>}
   *
   * @public
   */
  public async execute(): Promise<Daos> {
    const response = await super.execute()

    return response.daos
  }
}
