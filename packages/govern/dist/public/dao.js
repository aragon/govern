"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var configuration_1 = require("./configuration");
var DAOAction_1 = require("../internal/actions/DAOAction");
/**
 * TODO: Define return type in promise
 *
 * @param {string} address
 *
 * @returns {Promise<any>}
 */
function dao(address) {
    return new DAOAction_1.default(configuration_1.default.global, { address: address }).execute();
}
exports.default = dao;
//# sourceMappingURL=dao.js.map