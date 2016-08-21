"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _types = require("./../../utils/types");

var _curry = require("./curry");

var _curry2 = _interopRequireDefault(_curry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @public @function flip
 * - takes a function and flip the order of the first two arguments
 * - the returned function preserve's the original function's 'curried'
 *   status
 * - the flipped function will not preserve placeholders
 *   of the original curried function
 * - if the original function is curried with arity less than 2,
 *   the returned flipped function will be curried with arity 2
 *
 * @param {Function} f
 * - the function to flip the first two arguments for
 *
 * @returns {Function}
 * - a new function that will call the original function with the first
 *   two arguments' order flipped
 * - flip :: (a -> b -> c) -> b -> a -> c
 *
 * @throws TypeError
 * - if f is not a function
 */
exports.default = (0, _curry2.default)(function (f) {
  if ((typeof f === "undefined" ? "undefined" : _typeof(f)) !== _types.pFunction) throw new TypeError("Cannot call flip on Non-Function " + f + "!");

  var cArity = (0, _curry.getArity)(f);
  if (cArity === -1) return function (a, b) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return f.apply(undefined, [b, a].concat(args));
  };else if (cArity < 2) cArity = 2;

  return (0, _curry2.default)(function (a, b) {
    for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }

    return _curry.curriedApply.apply(undefined, [f, b, a].concat(args));
  }, cArity);
});