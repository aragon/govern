import { DocumentNode } from 'graphql';
import ClientInterface from './lib/ClientInterface';
/**
 * TODO: Use QueryResult type from govern-server/core
 *
 * @class GraphQLClient
 */
export default class GraphQLClient implements ClientInterface {
    private governUrl;
    /**
     * The urql/core Client object
     *
     * @var {Client} client
     *
     * @private
     */
    private client;
    /**
     * @param {string} governUrl
     *
     * @constructor
     */
    constructor(governUrl: string);
    /**
     * Initiates the Client from urql/core
     *
     * @method connect
     *
     * @returns {void}
     */
    private connect;
    /**
     * Executes the query against the connected Govern server
     *
     * @method request
     *
     * @param {DocumentNode} query
     * @param {Object} args
     *
     * @returns {Promise<any>}
     *
     * @public
     */
    request(query: DocumentNode, args?: any): Promise<any>;
    /**
     * Maps the received response into the required format
     *
     * @method mapResponse
     *
     * @param {any} result - Response from Govern server
     *
     * @returns {String}
     *
     * @private
     */
    private mapResponse;
    /**
     * Maps the received error into the required format
     *
     * @method mapError
     *
     * @param {any} error
     *
     * @returns {string}
     *
     * @private
     */
    private mapError;
}
