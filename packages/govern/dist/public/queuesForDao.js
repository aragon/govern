"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var configuration_1 = require("./configuration");
var QueuesForDaoAction_1 = require("../internal/actions/QueuesForDaoAction");
/**
 * TODO: Define return type in promise
 *
 * @param {string} address
 *
 * @returns {Promise<any>}
 */
function queuesForDao(address) {
    return new QueuesForDaoAction_1.default(configuration_1.default.global, { address: address }).execute();
}
exports.default = queuesForDao;
//# sourceMappingURL=queuesForDao.js.map