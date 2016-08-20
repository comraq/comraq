"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trim = exports.upper = exports.lower = exports.split = exports.replace = exports.repeat = exports.length = undefined;

var _checks = require("./../../utils/checks");

var _library = require("./../library");

/**
 * @public @function length
 * - gets the length of a string, array, object (number of keys)
 *   or function (function arity)
 *
 * @param {Any} target
 * - the target to retrieve the length
 *
 * @returns {Number}
 * - the length of the target
 *
 * @throws TypeError
 * - non-string, array, object or function
 */
var length = exports.length = function length(target) {
  if ((0, _checks.isNumber)(target.length)) return target.length;else if ((0, _checks.isObject)(target)) return target.keys().length;

  throw new TypeError("Cannot get length of " + target + "!");
};

/**
 * @public @function repeat
 * - composable curried version of String.prototype.repeat
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat
 */
var repeat = exports.repeat = (0, _library.currify)(function (count, s) {
  return s.repeat(count);
}, 2, false, _library.placeholder);

/**
 * @public @function replace
 * - composable curried version of String.prototype.replace
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
 */
var replace = exports.replace = (0, _library.currify)(function (expr, replacement, s) {
  return s.replace(expr, replacement);
}, 3, false, _library.placeholder);

/**
 * @public @function split
 * - composable curried version of String.prototype.split
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split
 */
var split = exports.split = (0, _library.currify)(function (sep, s) {
  return s.split(sep);
}, 2, false, _library.placeholder);

/**
 * @public @function lower
 * - composable curried version of String.prototype.toLowerCase
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase
 */
var lower = exports.lower = function lower(s) {
  return s.toLowerCase();
};

/**
 * @public @function upper
 * - composable curried version of String.prototype.toUpperCase
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase
 */
var upper = exports.upper = function upper(s) {
  return s.toUpperCase();
};

/**
 * @public @function trim
 * - composable curried version of String.prototype.trim
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
 */
var trim = exports.trim = function trim(s) {
  return s.trim();
};