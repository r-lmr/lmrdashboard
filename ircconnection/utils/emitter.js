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
exports.__esModule = true;
exports.myEmitter = void 0;
var events_1 = require("events");
var MyEmitter = /** @class */ (function (_super) {
    __extends(MyEmitter, _super);
    function MyEmitter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MyEmitter;
}(events_1.EventEmitter));
;
exports.myEmitter = new MyEmitter();
