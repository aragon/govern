"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var configuration_1 = require("./configuration");
var DAOSAction_1 = require("../internal/actions/DAOSAction");
/**
 * TODO: Define return type in promise
 *
 * @returns {Promise<any>}
 */
function daos() {
    return new DAOSAction_1.default(configuration_1.default.global).execute();
}
exports.default = daos;
//# sourceMappingURL=daos.js.map