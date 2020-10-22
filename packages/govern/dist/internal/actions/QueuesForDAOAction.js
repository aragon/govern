"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractAction_1 = require("./lib/AbstractAction");
var QueuesForDAOAction = /** @class */ (function (_super) {
    __extends(QueuesForDAOAction, _super);
    function QueuesForDAOAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QueuesForDAOAction;
}(AbstractAction_1.default));
exports.default = QueuesForDAOAction;
//# sourceMappingURL=QueuesForDAOAction.js.map