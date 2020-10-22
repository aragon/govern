import { DocumentNode } from 'graphql'
import GraphQLClient from '../../clients/GraphQLClient'
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
   * @param {any} parameters - The required parameters for this action
   * @param {Configuration} configuration - The current configuration to execute this action
   *
   * @constructor
   */
  constructor(protected configuration: Configuration, protected parameters?: any) {
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
