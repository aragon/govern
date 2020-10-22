"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var configuration_1 = require("./configuration");
var QueueAction_1 = require("../internal/actions/QueueAction");
/**
 * TODO: Define return type in promise
 *
 * @param {string} address
 *
 * @returns {Promise<any>}
 */
function queue(address) {
    return new QueueAction_1.default(configuration_1.default.global, { address: address }).execute();
}
exports.default = queue;
//# sourceMappingURL=queue.js.map