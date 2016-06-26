"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pipe = exports.compose = undefined;

var _checks = require("./../utils/checks");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @private @function getResult
 * - reduces the list of function arguments passed into pipe or compose
 *
 * @param {Function} reducerIterator
 * - the iterator function to iterate through the reducers
 *
 * @param {Boolean} spread
 * - boolean flag to indicate whether to spread results of previous
 *   function as multiple params into the next function
 * - this flag helps differentiate between whether the next function expects
 *   and array or expects mutliple arguments (in which case the result
 *   should be spread and passed in as multiple parameters)
 *
 * @param {Function, variadic} ...args
 * - the array of functions to compose/pipe
 *
 * @returns {Any}
 * - the accumulated result of calling all the composed/piped functions
 *
 * @throws Error
 * - if any non-functions are passed into the middle of the composition
 *   pipeline
 */
var getResult = function getResult(reducerIterator, spread) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  return reducerIterator.call(args, function (result, func) {
    if (!(0, _checks.isFunction)(func)) throw new Error("Composition functions cannot take non-function " + "as intermediate arguments!");

    /**
     * All user function params captured/bundled in array
     * Spread/Rest to pass them all into user function
     */
    if ((0, _checks.isArray)(result) && spread) return func.apply(undefined, _toConsumableArray(result));else return func(result);
  });
};

/**
 * @public @function compose
 * - composes any number of functions and executes them from right to left
 *   order, piping each result to next function
 *
 * @param {Function|Any} ...args
 * - any number of functions to compose, last argument can be non-function
 * - if a non-function last argument is provided, the result of the function
 *   pipeline will be executed immediately with the last argument as the
 *   ONLY function argument
 *
 * @returns {Function|Any}
 * - returns a piped function which will execute all functions when
 *   arguments are passed
 * - returns the result of executing the function pipeline if last arguments
 *   to ...args is non-function
 *
 * @throws Error
 * - if non-function arguments are passed before any functions in the
 *   pipeline
 */
var compose = exports.compose = function compose() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  var target = args[args.length - 1];

  if (!(0, _checks.isFunction)(target)) {
    if (args.length <= 1) throw new Error("Functions must be supplied before function arguments!");

    return getResult.apply(undefined, [Array.prototype.reduceRight, false].concat(args));
  }

  /**
   * Variadic due to needing to capture all trailing arguments
   * as params passed to user function
   *
   * Call user func by bundling all potential params in array
   */
  return function () {
    for (var _len3 = arguments.length, targets = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      targets[_key3] = arguments[_key3];
    }

    var spread = true;
    if (targets.length <= 1) {
      spread = false;
      targets = targets[0];
    }

    return getResult.apply(undefined, [Array.prototype.reduceRight, spread].concat(args, [targets]));
  };
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
  for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    args[_key4] = arguments[_key4];
  }

  var target = args[0];

  if (!(0, _checks.isFunction)(target)) {
    if (args.length <= 1) return target;else return getResult.apply(undefined, [Array.prototype.reduce, false].concat(args));
  }

  return function () {
    for (var _len5 = arguments.length, targets = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      targets[_key5] = arguments[_key5];
    }

    var spread = true;
    if (targets.length <= 1) {
      spread = false;
      targets = targets[0];
    }

    return getResult.apply(undefined, [Array.prototype.reduce, spread, targets].concat(args));
  };
};