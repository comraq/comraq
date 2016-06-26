"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slice = require("./slice");

Object.defineProperty(exports, "slice", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_slice).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @implements Monoid
 * - adds the empty and concatMutable methods for arrays
 */
Array.prototype.empty = function () {
  return [];
};
Array.prototype.concatMutable = function (next) {
  this.push(next);
  return this;
};