"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _types = require("./../../utils/types");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @private @var {Symbol} functorSymbol
 * - private symbol used when checking with instanceof
 */
var functorSymbol = Symbol.for("comraq-Functor");

exports.default = _defineProperty({
  /**
   * @public @function implement
   * - allows a source class to implement the Functor typeclass
   *
   * @param {Any} source
   * - the source class implementing Functor
   *
   * @param {Object} implementation
   * - an object containing an implementation of 'fmap' where fmap is defined
   *   as a function
   *
   * @return {Any}
   * - the updated source class
   *
   * @throws TypeError
   * - if the implementation object does not have a fmap function
   * - if fmap is later called without a function
   */
  implement: function implement(source, implementation) {
    if (_typeof(implementation.fmap) !== _types.pFunction) throw new TypeError("Cannot implement the Functor Typeclass without 'fmap'!");

    source.fmap = function (g) {
      if ((typeof g === "undefined" ? "undefined" : _typeof(g)) !== _types.pFunction) throw new TypeError("Cannot fmap with Non-Function " + g + "!");

      return implementation.fmap.call(this, g);
    };

    source[functorSymbol] = true;
    return source;
  }

}, Symbol.hasInstance, function (instance) {
  return instance[functorSymbol] === true;
});