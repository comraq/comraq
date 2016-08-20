"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _checks = require("./../../utils/checks");

var _curry = require("./curry");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @public @function nAry
 * - given a natural number and a function, returns the function with a
 *   arity that will be fixed to the provided number
 *
 * @param {Number} n
 * - the number to fix the arity to
 *
 * @param {Function} func
 * - the function to fix the arity for
 *
 * @return {Function}
 * - a new function which will only take n number of arguments and call
 *   func, returning its value
 *
 * @throws TypeError
 * - if n is not a natural number (less than 0)
 *
 * @throws TypeError
 * - if func is not a function
 */
exports.default = (0, _curry.currify)(function (n, func) {
  if (n < 0) throw new TypeError("nAry cannot fix the arity given a non natural number: " + n + "!");

  if (!(0, _checks.isFunction)(func)) throw new TypeError("nAry cannot fix the arity of non-function " + func + "!");

  if (n === 0) return function () {
    return func();
  };

  return (0, _curry.currify)(function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return func.apply(undefined, _toConsumableArray(args.slice(0, n)));
  }, n, false, _curry.placeholder);
}, 2, false, _curry.placeholder);