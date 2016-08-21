"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _types = require("./../../utils/types");

var _curry = require("./curry");

var _curry2 = _interopRequireDefault(_curry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @public @function nAry
 * - given a natural number and a function, returns the function with a
 *   arity that will be fixed/maxed at the provided number
 * - the returned function will preserve the original function's 'curried'
 *   status
 * - the fixed arity function will not preserve placeholders
 *   of the original curried function
 *
 * @param {Number} n
 * - the number to cap the arity to
 *
 * @param {Function} func
 * - the function to fix the arity for
 *
 * @return {Function}
 * - a new function which will only take n number of arguments and call
 *   func, returning its value
 *
 * @throws RangeError
 * - if n is not a natural number (less than 0)
 *
 * @throws TypeError
 * - if func is not a function
 */
exports.default = (0, _curry2.default)(function (n, func) {
  if (n < 0) throw new RangeError("nAry cannot fix the arity given a non natural number: " + n + "!");

  if ((typeof func === "undefined" ? "undefined" : _typeof(func)) !== _types.pFunction) throw new TypeError("nAry cannot fix the arity of non-function " + func + "!");

  if (!(0, _curry.isCurried)(func)) return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return func.apply(undefined, _toConsumableArray(args.slice(0, n)));
  };

  return (0, _curry2.default)(function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return func.apply(undefined, _toConsumableArray(args.slice(0, n)));
  }, n);
}, 2, _curry.placeholder);