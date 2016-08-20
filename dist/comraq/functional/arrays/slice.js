"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _library = require("./../library");

/**
 * @public @function slice
 * - composable curried version of Array.prototype.slice
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
 */
exports.default = (0, _library.currify)(function (begin, end, target) {
  return target.slice(begin, end);
}, 3, false, _library.placeholder);