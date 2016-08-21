"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _types = require("./../../utils/types");

var _Functor = require("./Functor");

var _Functor2 = _interopRequireDefault(_Functor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @private @var {Symbol} applicativeSymbol
 * - private symbol used when checking with instanceof
 */
var applicativeSymbol = Symbol.for("comraq-Applicative");

exports.default = _defineProperty({
  /**
   * @public @function implement
   * - allows a source class to implement the Applicative typeclass
   *
   * @param {Any} source
   * - the source class implementing Applicative
   *
   * @param {Object} implementation
   * - an object containing an implementation of 'of' and 'ap'
   *   where of and fmap are defined as a functions
   *
   * @return {Any}
   * - the updated source class
   *
   * @throws TypeError
   * - if the source class does not implement Functor
   * - if the implementation object does not have an
   *   'of' or 'ap' function
   * - if ap is later called with a different Applicative
   *   class than source
   */
  implement: function implement(source, implementation) {
    if (!(source instanceof _Functor2.default)) throw new TypeError(source + " must be an instance of Functor before " + "implementing Applicative!");else if (_typeof(implementation.ap) !== _types.pFunction) throw new TypeError("Cannot implement the Applicative Typeclass without 'ap'!");else if (_typeof(implementation.of) !== _types.pFunction) throw new TypeError("Cannot implement the Applicative Typeclass without 'of'!");

    source.of = implementation.of;
    source.ap = function (a) {
      if (!(a instanceof source)) throw new TypeError("Cannot ap between Applicatives of different types!");

      return implementation.ap.call(this, a);
    };

    source[applicativeSymbol] = true;
    return source;
  }

}, Symbol.hasInstance, function (instance) {
  return instance[applicativeSymbol] === true;
});