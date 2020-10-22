import ClientInterface from '../clients/lib/ClientInterface';
/**
 * @class Configuration
 */
export default class Configuration {
    /**
     * Holds the validated configuration object
     *
     * @var config
     *
     * @private
     */
    private config;
    /**
     * @param {Object} config
     *
     * @constructor
     */
    constructor(config: any);
    /**
     * TODO: Use a ConfigurationError object
     *
     * Does set and parse the given configuration object
     *
     * @method setConfig
     *
     * @returns {void}
     *
     * @private
     */
    private setConfig;
    /**
     * Getter for governURL
     *
     * @var governURL
     *
     * @public
     */
    get governURL(): string;
    /**
     * Getter for client property
     *
     * @var client
     *
     * @public
     */
    get client(): ClientInterface;
}
