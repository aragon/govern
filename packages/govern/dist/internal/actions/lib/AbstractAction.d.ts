import { DocumentNode } from 'graphql';
import Configuration from '../../configuration/Configuration';
/**
 * @class AbstractAction
 */
export default abstract class AbstractAction {
    protected configuration: Configuration;
    protected parameters?: any;
    /**
     * Contains the GraphQL query of the current action
     *
     * @var {string} gqlQuery
     *
     * @protected
     */
    protected gqlQuery: DocumentNode;
    /**
     * @param {any} parameters - The required parameters for this action
     * @param {Configuration} configuration - The current configuration to execute this action
     *
     * @constructor
     */
    constructor(configuration: Configuration, parameters?: any);
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
    execute(): Promise<any>;
}
