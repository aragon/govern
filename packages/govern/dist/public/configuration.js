"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Configuration_1 = require("../internal/configuration/Configuration");
/**
 * Does set the global configuration for Govern
 *
 * @param {any} config
 *
 * @returns {void}
 */
function configuration(config) {
    configuration.global = new Configuration_1.default(config);
}
exports.default = configuration;
// TODO: define type
//@ts-ignore
configuration.global = null;
//# sourceMappingURL=configuration.js.map