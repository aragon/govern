"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var configuration_1 = require("./configuration");
var GamesAction_1 = require("../internal/actions/GamesAction");
/**
 * TODO: Define return type in promise
 *
 * @returns {Promise<any>}
 */
function games() {
    return new GamesAction_1.default(configuration_1.default.global).execute();
}
exports.default = games;
//# sourceMappingURL=games.js.map