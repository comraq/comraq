"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _checks = require("./../../utils/checks");

var _curry = require("./../curry");

var _algebraic = require("./../algebraic");

var _iterables = require("./../iterables");

var _concat = require("./concat");

var _Reduced = require("./Reduced");

var _Transformer = require("./Transformer");

var _Transformer2 = _interopRequireDefault(_Transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @public @function interpose
 * - takes any entry and an iterable collection, returning a new iterable with
 *   the entry inserted between every element in the original collection
 *
 * @param {Any} entry
 * - any entry/element
 *
 * @param {Transformer|Iterable} target
 * - the transformer or target iterable
 *
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a new iterable with entry inserted between each element from the
 *   original collection
 */
exports.default = (0, _curry.currify)(function (entry, target) {
  if (!(0, _Transformer.isTransformer)(target)) return _interpose(entry, target);

  var started = false;
  return (0, _Transformer2.default)(function (acc, next) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    if (!started) {
      started = true;
      return _Transformer.step.apply(undefined, [target, acc, next].concat(args));
    }

    var result = _Transformer.step.apply(undefined, [target, acc, entry].concat(args));
    if ((0, _Reduced.isReduced)(result)) return result;

    return _Transformer.step.apply(undefined, [target, result, next].concat(args));
  }, function (acc) {
    return (0, _Transformer.complete)(target, acc);
  }, function () {
    return (0, _Transformer.init)(target);
  });
}, 2, false, _curry.placeholder);

/**
 * @private @function _interpose
 * - private version of interpose that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 *
 * @see @function interpose
 *
 * @throws TypeError
 * - target is not an iterable
 */

var _interpose = function _interpose(entry, target) {
  if (!(0, _checks.isIterable)(target)) throw new Error("Cannot interpose elements for non-iterable " + target + "!");

  var result = (0, _algebraic.empty)(target);

  var iterator = (0, _iterables.getIterator)(target);
  var item = iterator.next();

  if (!item.done) {
    result = (0, _concat.concatMutable)(item.value, result);
    for (item = iterator.next(); !item.done; item = iterator.next()) {
      result = (0, _concat.concatMutable)(item.value, (0, _concat.concatMutable)(entry, result));
    }
  }

  return result;
};