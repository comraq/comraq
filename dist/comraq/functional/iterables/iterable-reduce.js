"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _curry = require("./../curry");

var _checks = require("./../../utils/checks");

var _getIterator = require("./get-iterator");

var _getIterator2 = _interopRequireDefault(_getIterator);

var _Transformer = require("./../transducers/Transformer");

var _Reduced = require("./../transducers/Reduced");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @private @function reduce
 * - reduces down the list of elements in the iterable given a reducing
 *   function and initial accumulator
 *
 * @param {Function} func
 * - the reducing function
 *
 * @param {Any} acc
 * - the initial accumulator
 *
 * @param {Iterable} iterable
 * - the iterable to iterate through
 *
 * @param {Number} index (optional)
 * - the index of the current element in the iterating sequence passed
 *   as an additional parameter to the reducing function (index starting from 0)
 *
 * @param {Iterator} iterator (optional)
 * - the starting iterator (if not starting the reducing function from the
 *   beginning of the iteratable sequence)
 *
 * @returns {Any}
 * - the reduced result stored in the accumulator - acc
 *
 * @throws Error
 * - if func is not a function
 *
 * @throws Error
 * - if iterable is not/does not implement the iterator interface
 */
var reduce = (0, _curry.currify)(function (func, acc, iterable) {
  var index = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
  var iterator = arguments.length <= 4 || arguments[4] === undefined ? (0, _getIterator2.default)(iterable) : arguments[4];

  if (!(0, _checks.isIterable)(iterable)) throw new Error("Cannot get iterator of non-iterable " + iterable + "!");else if (!(0, _checks.isFunction)(func)) throw new Error("iterableReduce expected a reducing function, got " + func + "!");else if ((0, _Transformer.isTransformer)(func)) return reduceT(func, acc, iterable, index, iterator);

  var item = iterator.next();
  if (item.done) return acc;

  acc = func(acc, item.value, index, iterable);
  return reduce(func, acc, iterable, index + 1, iterator);
}, 3, false, _curry.placeholder);

exports.default = reduce;

/**
 * @private @function reduceT
 * - same as reduce but modified for reducing transducers
 * - calls the transformer's complete function (1-arity) at the end of
 *   iteration
 * - also checks for early termination by calling deref on the accumulated
 *   result if result is of Reduced monad
 *
 * @see reduce
 * @link https://www.youtube.com/watch?v=6mTbuzafcII
 * @link https://www.youtube.com/watch?v=4KqUvG8HPYo
 */

var reduceT = function reduceT(func, acc, iterable, index, iterator) {
  var item = iterator.next();

  if (item.done) return (0, _Transformer.complete)(func, acc);

  acc = (0, _Transformer.step)(func, acc, item.value, index, iterable);
  if ((0, _Reduced.isReduced)(acc)) return (0, _Reduced.deref)(acc);

  return reduceT(func, acc, iterable, index + 1, iterator);
};