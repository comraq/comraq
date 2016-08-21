"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pipe = exports.compose = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _types = require("./../../utils/types");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @private @function applyFunctions
 * - reduces the list of function arguments passed into pipe or compose
 *   after accepting arguments
 *
 * @param {Function} fold
 * - the fold function (can be foldl/reduce or foldr/reduceRight)
 *
 * @param {Array<Function>} funcs
 * - an array of functions to eventually fold over
 *
 * @returns {Function :: variadic -> Any}
 * - a function accepting any number of arguments,
 * - first calling the the first function in funcs with args, then
 *   repeated piping the results of the function from the previous to the next
 *
 * @throws TypeError
 * - if any non-functions are passed into the middle of the composition
 *   pipeline
 */
var applyFuncs = function applyFuncs(fold, funcs) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var first = true;
    return fold.call(funcs, function (args, func) {
      if ((typeof func === "undefined" ? "undefined" : _typeof(func)) !== _types.pFunction) throw new TypeError("Composition cannot take non-function " + "as intermediate arguments!");

      if (first) {
        first = false;
        return func.apply(undefined, _toConsumableArray(args));
      }
      return func(args);
    }, args);
  };
};

/**
 * @public @function compose
 * - composes any number of functions and executes them from right to left
 *   order, piping each result to next function
 *
 * @param {Function|Any} ...args
 * - any number of functions to compose
 *
 * @returns {Function|Any}
 * - returns a piped function which will execute all functions when
 *   further arguments are passed
 *
 * @throws Error
 * - if non-function arguments are passed before any functions in the
 *   pipeline
 */
var compose = exports.compose = function compose() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return applyFuncs(Array.prototype.reduceRight, args);
};

/**
 * @public @function pipe
 * - pipe any number of functions and executes them from left to right
 *   order, piping each result to next function
 *
 * @see @function compose
 * - this function is completely the same as compose except for
 *   executing the functions with the reverse order
 */
var pipe = exports.pipe = function pipe() {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  return applyFuncs(Array.prototype.reduce, args);
};