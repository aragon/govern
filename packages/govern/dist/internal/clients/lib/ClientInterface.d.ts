/**
 * @interface ClientInterface
 */
export default interface ClientInterface {
    /**
     * Provides a common interface for our GraphQL and REST client
     *
     * @method request
     *
     * @param {any} query
     * @param {any} args
     *
     * @returns {any}
     */
    request(query: any, args: any): any;
}
