import AbstractAction from './lib/AbstractAction'
import dao from '../clients/graphql/queries/dao'
import { Dao } from '../clients/graphql/fragments/dao-entry'

/**
 * @class DaoAction
 */
export default class DaoAction extends AbstractAction {
  /**
   * Contains the GraphQL query of the current action
   *
   * @var {string} gqlQuery
   *
   * @protected
   */
  protected gqlQuery: string = dao

  /**
   * @param {{name: string}} parameters
   *
   * @constructor
   */
  constructor(parameters: { name: string }) {
    super(parameters)
  }


  /**
   * Will execute the action and returns the response as expected.
   *
   * @method execute
   *
   * @returns {Promise<Dao|null>}
   *
   * @public
   */
  public async execute(): Promise<Dao|null> {
    const response = await super.execute()

    return response.dao
  }
}
