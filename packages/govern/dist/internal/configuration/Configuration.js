"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GraphQLClient_1 = require("../clients/GraphQLClient");
/**
 * @class Configuration
 */
var Configuration = /** @class */ (function () {
    /**
     * @param {Object} config
     *
     * @constructor
     */
    function Configuration(config) {
        this.setConfig(config);
    }
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
    Configuration.prototype.setConfig = function (config) {
        if (!config.governURL) {
            throw new Error('Missing Govern server URL!');
        }
        this.config = {
            governURL: config.governURL,
            client: new GraphQLClient_1.default(config.governURL)
        };
    };
    Object.defineProperty(Configuration.prototype, "governURL", {
        /**
         * Getter for governURL
         *
         * @var governURL
         *
         * @public
         */
        get: function () {
            return this.config.governURL;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Configuration.prototype, "client", {
        /**
         * Getter for client property
         *
         * @var client
         *
         * @public
         */
        get: function () {
            return this.config.client;
        },
        enumerable: false,
        configurable: true
    });
    return Configuration;
}());
exports.default = Configuration;
//# sourceMappingURL=Configuration.js.map