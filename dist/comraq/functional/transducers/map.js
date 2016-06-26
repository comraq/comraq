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
 * @public @function map
 * - map a function against a functor, a Monoid
 *   or all elements of an iterable collection
 * - in addition, this also passes the index, original iterable and the number
 *   of times the predicate function to keep was called as the second and
 *   third, and fourth argument
 *
 * @param {Function} func
 * - the mapping function applied against each element in the iterable
 *
 * @param {Transformer|Iterable|Functor|Monoid} target
 * - the transformer or target iterable/functor
 *
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a new iterable with all elements
 *   applied with the mapping functon
 *
 * @throws TypeError
 * - mapping function func is not a function
 */
exports.default = (0, _curry.currify)(function (func, target) {
  if (!(0, _checks.isFunction)(func)) throw new TypeError("map cannot be applied without first specifying a function!");

  if (!(0, _Transformer.isTransformer)(target)) return _map(func, target);

  var i = 0;
  return (0, _Transformer2.default)(function (acc, next) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return _Transformer.step.apply(undefined, [target, acc, func.apply(undefined, [next].concat(args, [i++]))].concat(args));
  }, function (acc) {
    return (0, _Transformer.complete)(target, acc);
  }, function () {
    return (0, _Transformer.init)(target);
  });
}, 2, false, _curry.placeholder);

/**
 * @private @function _map
 * - private version of map that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 * - uses the iterables's reduce to carry out the mapping function across
 *   all elements in the iterable
 *
 * @see @function map
 * @see @function iterables/reduce
 */

var _map = function _map(func, target) {
  var i = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
  return (0, _iterables.reduce)(function (acc, next, index, target) {
    return (0, _concat.concatMutable)(func(next, index, target, i++), acc);
  }, (0, _algebraic.empty)(target), target);
};