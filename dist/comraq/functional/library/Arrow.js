"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _of$Symbol$hasInstanc;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _types = require("./../../utils/types");

var _categories = require("./../categories");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @private @var {Symbol} arrowSymbol
 * - private symbol used when checking with instanceof
 */
var arrowSymbol = Symbol.for("comraq-Arrow");

/**
 * @private @function _compose
 * - helper function to compose two functions together
 */
var _compose = function _compose(g, f) {
  return function () {
    return g(f.apply(undefined, arguments));
  };
};

/**
 * @private @class Arrow
 * - the Arrow class, 'wrapping' regular functions
 *
 * @implements Functor
 */
var Arrow = _defineProperty({}, arrowSymbol, true);

/**
 * @private @function _pure
 * - helper function for copy a function into an Arrow instance
 *
 * @param {Function} f
 * - the function to lift
 *
 * @return {Function, Arrow}
 * - the original function f with properties and symbols from Arrow
 *   set directly onto the function
 * - as to avoid mutating Function.prototype, duck typing as Arrow
 */
var _pure = function _pure(f) {
  /**
   * Alternative For Instantiating Arrow as functions
   * by copying all properties and symbols from the Arrow class to
   * the created function
   * - Not used because unecessary/expensive to copy all properties
   *   everytime?
   *
   * for (const prop in Arrow)
   *   f[prop] = Arrow[prop];
   *
   * for (const symbol of Object.getOwnPropertySymbols(Arrow))
   *   f[symbol] = Arrow[symbol];
   *
   * f.__func = f;
   * return f;
   */

  var arrow = Object.create(Arrow, {
    __func: { value: f },
    run: { value: f }
  });

  return arrow;
};

/**
 * @public @function of
 * - lifts any value into an Arrow that will return the original value
 *   when called (the called arguments are ignored)
 *
 * @param {Any} x
 * - the value that will be returned when Arrow "function" is called
 *
 * @see @private @function _pure
 */
var of = function of(x) {
  return _pure(function () {
    return x;
  });
};

/**
 * Implementations of Typeclasses
 */
_categories.Functor.implement(Arrow, {
  fmap: function fmap(g) {
    var f = _compose(g, this.__func);
    return _pure(f);
  }
});

_categories.Applicative.implement(Arrow, {
  of: of,
  ap: function ap(g) {
    return g.fmap(this.__func);
  }
});

/**
 * Define Exposed API in the Object Literal Below
 */
exports.default = (_of$Symbol$hasInstanc = {
  of: of

}, _defineProperty(_of$Symbol$hasInstanc, Symbol.hasInstance, function (instance) {
  return instance[arrowSymbol] === true;
}), _defineProperty(_of$Symbol$hasInstanc, "lift", function lift(func) {
  if ((typeof func === "undefined" ? "undefined" : _typeof(func)) !== _types.pFunction) throw new TypeError("Non-Function '" + func + "' cannot be made into Arrow using 'lift'!");

  return _pure(function () {
    return func.apply(undefined, arguments);
  });
}), _of$Symbol$hasInstanc);