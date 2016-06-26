"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reduceRight1 = exports.reduceRight = exports.reduce1 = undefined;

var _checks = require("./../../utils/checks");

var _curry = require("./../curry");

var _iterableReduce = require("./iterable-reduce");

var _iterableReduce2 = _interopRequireDefault(_iterableReduce);

var _getIterator = require("./get-iterator");

var _getIterator2 = _interopRequireDefault(_getIterator);

var _reverse = require("./reverse");

var _reverse2 = _interopRequireDefault(_reverse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @public @function reduce
 * - reduce left against an iterable taking an reducer and an accumulator
 *
 * @param {Function} func
 * - the reducing function, reducer
 *
 * @param {Any} acc
 * - the initial accumulator
 *
 * @param {Iterable} iterable
 * - the iterable collection to be reduced
 *
 * @returns {Any}
 * - the accumulated result, same type as acc
 *
 * @throws TypeError
 * - reducer func, is not a function
 *
 * @throws TypeError
 * - iterable is not/does not implement the iterable interface
 */
exports.default = (0, _curry.currify)(function (func, acc, iterable) {
  if (!(0, _checks.isFunction)(func)) throw new TypeError("reduce cannot be applied without first specifying a function!");else if (!(0, _checks.isIterable)(iterable)) throw new TypeError("reduce cannot be applied on a non-iterable!");

  return (0, _iterableReduce2.default)(func, acc, iterable);
}, 3, false, _curry.placeholder);

/**
 * @public @function reduce1
 * - same as reduce except without needing an accumulator by passing the
 *   first element in the iteration as the accumulator
 *
 * @see @function reduce
 */

var reduce1 = exports.reduce1 = (0, _curry.currify)(function (func, iterable) {
  if (!(0, _checks.isFunction)(func)) throw new TypeError("reduce1 cannot be applied without first specifying a function!");else if (!(0, _checks.isIterable)(iterable)) throw new TypeError("reduce1 cannot be applied on a non-iterable!");

  var iterator = (0, _getIterator2.default)(iterable);
  return (0, _iterableReduce2.default)(func, iterator.next().value, iterable, 1, iterator);
}, 2, false, _curry.placeholder);

/**
 * @public @function reduceRight
 * - same as reduce except traversing the iterable in the reverse order
 *
 * @see @function reduce
 */
var reduceRight = exports.reduceRight = (0, _curry.currify)(function (func, acc, iterable) {
  if (!(0, _checks.isFunction)(func)) throw new TypeError("reduceRight cannot be applied without first specifying a function!");else if (!(0, _checks.isIterable)(iterable)) throw new TypeError("reduceRight cannot be applied on a non-iterable!");

  iterable = (0, _reverse2.default)(iterable);
  return (0, _iterableReduce2.default)(func, acc, iterable);
}, 3, false, _curry.placeholder);

/**
 * @public @function reduceRight1
 * - same as reduceRight except without needing an accumulator by passing the
 *   first element in the iteration as the accumulator
 *
 * @see @function reduceRight
 */
var reduceRight1 = exports.reduceRight1 = (0, _curry.currify)(function (func, iterable) {
  if (!(0, _checks.isFunction)(func)) throw new TypeError("reduceRight1 cannot be applied without first specifying a function!");else if (!(0, _checks.isIterable)(iterable)) throw new TypeError("reduceRight1 cannot be applied on a non-iterable!");

  iterable = (0, _reverse2.default)(iterable);
  var iterator = (0, _getIterator2.default)(iterable);

  return (0, _iterableReduce2.default)(func, iterator.next().value, iterable, 1, iterator);
}, 2, false, _curry.placeholder);