"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.concatMutable = undefined;

var _Transformer = require("./Transformer");

var _Transformer2 = _interopRequireDefault(_Transformer);

var _Monoid = require("./../algebraic/Monoid");

var _algebraic = require("./../algebraic");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: needs work, currently simple placeholders for tests

/**
 * @public @function concat
 * - the transformer version of _concat with acc and next arguments reversed
 *   for the transformer step version of the function
 *
 * @returns {Transfomer}
 * - concat augmented with the Transformer mixin
 *
 * @see @function algebraic/concat
 * @see @mixin Transformer
 */
exports.default = (0, _Transformer2.default)(_Monoid._concat, _algebraic.identity, _Monoid._concat, function (acc, next) {
  return (0, _Monoid._concat)(next, acc);
});

/**
 * @public @function concatMutable
 * - the transformer version of _concatMutable with acc and next arguments
 *   reversed for the transformer step version of the function
 *
 * @returns {Transfomer}
 * - concatMutable augmented with the Transformer mixin
 *
 * @see @function algebraic/concatMutable
 * @see @mixin Transformer
 */

var concatMutable = exports.concatMutable = (0, _Transformer2.default)(_Monoid._concatMutable, _algebraic.identity, _Monoid._concatMutable, function (acc, next) {
  return (0, _Monoid._concatMutable)(next, acc);
});