import { DocumentNode } from 'graphql'
import Configuration from '../../configuration/Configuration'

/**
 * @class AbstractAction
 */
export default abstract class AbstractAction {
  /**
   * Contains the GraphQL query of the current action
   *
   * @var {string} gqlQuery
   *
   * @protected
   */
  protected gqlQuery: DocumentNode

  /**
   * The current configuration to execute this action
   *
   * @var {Configuration} configuration
   *
   * @protected
   */
  protected configuration: Configuration

  /**
   * The required parameters for this action
   *
   * @param {any} parameters
   *
   * @protected
   */
  protected parameters?: any

  /**
   * @param {any} parameters - The required parameters for this action
   *
   * @constructor
   */
  constructor(parameters?: any) {
    this.configuration = Configuration.get()
    this.parameters = this.validateParameters(parameters)
  }

  /**
   * Validates the given parameters
   *
   * @method validateParameters
   *
   * @param {any} parameters
   *
   * @returns {any}
   */
  protected validateParameters(parameters?: any): any {
    return parameters;
  }

  /**
   * TODO: Add if to check in the future if REST is configured for this execution
   *
   * Will execute the action and return the response from the Govern server.
   *
   * @method execute
   *
   * @returns {Promise<any>}
   *
   * @public
   */
  public execute(): Promise<any> {
    return this.configuration.client.request(this.gqlQuery, this.parameters)
  }
}
