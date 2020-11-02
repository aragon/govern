import AbstractAction from './lib/AbstractAction'
import daos, { Daos } from '../clients/graphql/queries/daos'

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

    return response.daos;
  }
}
