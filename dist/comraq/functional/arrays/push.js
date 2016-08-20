"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pushMutable = undefined;

var _transducers = require("./../transducers");

var _library = require("./../library");

var _checks = require("./../../utils/checks");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @private @function _push
 * - point free non-mutating version of Array.prototype.push
 *
 * @param {Any} value
 * - the target value to push onto the end of the array
 *
 * @param {Array} array
 * - the target array to push to
 *
 * @returns {Array}
 * - the new array with value pushed onto the end
 *
 * @throws TypeError
 * - if array is not of array type
 *
 * @link - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
 */
var _push = function _push(value, array) {
  if (!(0, _checks.isArray)(array)) throw new TypeError("Cannot call push on non-array " + array + "!");

  return [].concat(_toConsumableArray(array), [value]);
};

/**
 * @public @function push
 * - the transformer version of _push with acc and next arguments reversed
 *   for the transformer step version of the function
 *
 * @returns {Transfomer}
 * - _push augmented with the Transformer mixin
 *
 * @see @mixin Transformer
 * @see @function _push
 */
exports.default = (0, _transducers.Transformer)(_push, _library.identity, _push, function (acc, next) {
  return _push(next, acc);
});

/**
 * @private @function _pushMutable
 * - point free mutating version of Array.prototype.push
 *
 * @param {Any} value
 * - the target value to push onto the end of the array
 *
 * @param {Array} array
 * - the target array to push to
 *
 * @returns {Array}
 * - the new array with value pushed onto the end
 *
 * @throws TypeError
 * - if array is not of array type
 *
 * @link - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
 */

var _pushMutable = function _pushMutable(value, array) {
  if (!(0, _checks.isArray)(array)) throw new TypeError("Cannot call pushMutable on non-array " + array + "!");

  array.push(value);
  return array;
};

/**
 * @public @function pushMutable
 * - the transformer version of _pushMutable with acc and next arguments
 *   reversed for the transformer step version of the function
 *
 * @returns {Transfomer}
 * - _push augmented with the Transformer mixin
 *
 * @see @mixin Transformer
 * @see @function _pushMutable
 */
var pushMutable = exports.pushMutable = (0, _transducers.Transformer)(_pushMutable, _library.identity, _pushMutable, function (acc, next) {
  return _pushMutable(next, acc);
});