"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _checks = require("./../../utils/checks");

/**
 * @public @function composable
 * - auto wraps a function to only execute if passed in a non-function
 *   as argument
 *
 * @param {Function} selfFunc
 * - the function to be auto-wrapped
 *
 * @returns {Function}
 * - the same function passed in but will non execute but continuously
 *   compose with further functions passed in, without explicitly calling
 *   compose or pipe
 *
 * @throws Error
 * - non-function passed as first argument
 */
var composable = function composable(selfFunc) {
  if (!(0, _checks.isFunction)(selfFunc)) throw new Error("First argument '" + selfFunc + "' of currify is not a function!");

  return function () {
    var _this = this;

    var next = arguments[0];

    if (!(0, _checks.isFunction)(next)) {
      // First argument is not a function, execute and return result

      // Always pass all potential arguments to to-be-called function (selfFunc)
      // Regardless of selfFunc.length
      return selfFunc.apply(this, arguments);
    }

    // Always pass all potential arguments to to-be-called function (selfFunc)
    // Regardless of selfFunc.length
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return composable(selfFunc)(next.apply(_this, args));
    };
  };
};

exports.default = composable;