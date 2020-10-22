"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var configuration_1 = require("./configuration");
var GameAction_1 = require("../internal/actions/GameAction");
/**
 * TODO: Define return type in promise
 *
 * @param {string} name
 *
 * @returns {Promise<any>}
 */
function game(name) {
    return new GameAction_1.default(configuration_1.default.global, { name: name }).execute();
}
exports.default = game;
//# sourceMappingURL=game.js.map