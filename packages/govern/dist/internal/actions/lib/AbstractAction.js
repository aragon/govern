"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class AbstractAction
 */
var AbstractAction = /** @class */ (function () {
    /**
     * @param {any} parameters - The required parameters for this action
     * @param {Configuration} configuration - The current configuration to execute this action
     *
     * @constructor
     */
    function AbstractAction(configuration, parameters) {
        this.configuration = configuration;
        this.parameters = parameters;
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
    AbstractAction.prototype.execute = function () {
        return this.configuration.client.request(this.gqlQuery, this.parameters);
    };
    return AbstractAction;
}());
exports.default = AbstractAction;
//# sourceMappingURL=AbstractAction.js.map