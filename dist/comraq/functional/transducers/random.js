"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _checks = require("./../../utils/checks");

var _curry = require("./../curry");

var _algebraic = require("./../algebraic");

var _iterables = require("./../iterables");

var _concat = require("./concat");

var _Transformer = require("./Transformer");

var _Transformer2 = _interopRequireDefault(_Transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @public @function random
 * - takes a floating point probability number between 0.0 - 1.0 and an
 *   iterable collection, then returns a subset of the collection with the
 *   given probability
 *
 * @param {Number} prob
 * - the floating point probability
 *
 * @param {Transformer|Iterable} target
 * - the transformer or target iterable
 *
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a new iterable with elements each with probability of prob to
 *   to exist
 *
 * @throws TypeError
 * - prob is not a valid number between 0.0 - 1.0 (inclusive)
 */
exports.default = (0, _curry.currify)(function (prob, target) {
  if (!(0, _checks.isNumber)(prob) || prob < 0 || prob > 1) throw new TypeError("random cannot be applied with invalid probability " + prob + "!");

  if (!(0, _Transformer.isTransformer)(target)) return _random(prob, target);

  return (0, _Transformer2.default)(function (acc, next) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return Math.random() < prob ? _Transformer.step.apply(undefined, [target, acc, next].concat(args)) : acc;
  }, function (acc) {
    return (0, _Transformer.complete)(target, acc);
  }, function () {
    return (0, _Transformer.init)(target);
  });
}, 2, false, _curry.placeholder);

/**
 * @private @function _random
 * - private version of random that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 *
 * @see @function random
 *
 * @throws TypeError
 * - target is not an iterable
 */

var _random = function _random(prob, target) {
  if (!(0, _checks.isIterable)(target)) throw new Error("Cannot get random elements from non-iterable " + target + "!");

  var result = (0, _algebraic.empty)(target);

  var iterator = (0, _iterables.getIterator)(target);
  for (var item = iterator.next(); !item.done; item = iterator.next()) {
    result = Math.random() < prob ? (0, _concat.concatMutable)(item.value, result) : result;
  }return result;
};