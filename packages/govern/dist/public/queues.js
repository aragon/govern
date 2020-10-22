"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var configuration_1 = require("./configuration");
var QueuesAction_1 = require("../internal/actions/QueuesAction");
/**
 * TODO: Define return type in promise
 *
 * @returns {Promise<any>}
 */
function queues() {
    return new QueuesAction_1.default(configuration_1.default.global).execute();
}
exports.default = queues;
//# sourceMappingURL=queues.js.map