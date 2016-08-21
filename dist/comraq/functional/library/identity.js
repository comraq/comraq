"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _curry = require("./curry");

var _curry2 = _interopRequireDefault(_curry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @public @function identity
 * - the identity function that takes an argument and returns it
 *
 * @param {Any} target
 * - the target argument
 *
 * @returns {Any}
 * - the exact target passed in as argument
 */
exports.default = (0, _curry2.default)(function (target) {
  return target;
});