import Client from '../../graphql/Client'
import Configuration from '../../configuration/Configuration'

/**
 * @class AbstractAction
 */
export default abstract class AbstractAction {
  /**
   * Contains the GraphQL query of the current action
   *
   * @var gqlQuery
   * @protected
   */
  protected gqlQuery: string;


  /**
   * @param {any} parameters - The required parameters for this action
   * @param {Configuration} configuration - The current configuration to execute this action
   * @param {Client} client - The GraphQL client wrapper later also the REST client wrapper
   *
   * @constructor
   */
  constructor(protected parameters: any, protected configuration: Configuration, protected client: Client) {}

  /**
   * Will execute the action and return the response from the Govern server.
   *
   * @method execute
   *
   * @public
   */
  public abstract execute(): Promise<any>;
}