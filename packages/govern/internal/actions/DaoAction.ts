import AbstractAction from './lib/AbstractAction'
import dao, { Dao } from '../clients/graphql/queries/dao'

interface DaoEntry {
   id: string,
   executor: Dao
}

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
   * Format the result to Doa
   *
   * @method format
   *
   * @returns {Promise<Dao>}
   *
   * @protected
   */
  protected format( { registryEntries }: { registryEntries: DaoEntry[] } ): Dao | null {

    return registryEntries?.[0]?.executor ?? null;
  }

  /**
   * Will execute the action and returns the response as expected.
   *
   * @method execute
   *
   * @returns {Promise<Dao>}
   *
   * @public
   */
  public async execute(): Promise<Dao> {
    const response = await super.execute()

    return response;
  }
}
