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

var _algebraic = require("./../algebraic");

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
 *
 * @throws TypeError
 * - iterable is empty
 */

var reduce1 = exports.reduce1 = (0, _curry.currify)(function (func, iterable) {
  if (!(0, _checks.isFunction)(func)) throw new TypeError("reduce1 cannot be applied without first specifying a function!");else if (!(0, _checks.isIterable)(iterable)) throw new TypeError("reduce1 cannot be applied on a non-iterable!");

  var iterator = (0, _getIterator2.default)(iterable);
  var first = iterator.next();
  if (first.done) throw new TypeError("Cannot reduce1 aganist empty iterables!");

  return (0, _iterableReduce2.default)(func, first.value, iterable, 1, iterator);
}, 2, false, _curry.placeholder);

/**
 * @private @function _reduceR
 * - private helper method for implementing reduceRight and reduceRight1
 *   via reduce
 *
 * @param {Function} reducer
 * - the reducer function to be called during each iteration of reduce
 *
 * @returns {Any}
 * - a wrapper function passed to reduce that returns a function taking in
 *   the actual accumulator
 * - a chain series of partially applied wrapper functions are generated
 *   during reduce, at the end of which all gets called, executing the
 *   reducer in the "reverse" order
 */
var _reduceR = function _reduceR(reducer) {
  return function (prevFunc, val, index, source) {
    return function (acc) {
      return prevFunc(reducer(acc, val, index, source));
    };
  };
};

/**
 * @public @function reduceRight
 * - same as reduce except traversing the iterable in the reverse order
 *
 * @see @function reduce
 */
var reduceRight = exports.reduceRight = (0, _curry.currify)(function (func, acc, iterable) {
  if (!(0, _checks.isFunction)(func)) throw new TypeError("reduceRight cannot be applied without first specifying a function!");else if (!(0, _checks.isIterable)(iterable)) throw new TypeError("reduceRight cannot be applied on a non-iterable!");

  var f = _reduceR(func);
  return (0, _iterableReduce2.default)(f, _algebraic.identity, iterable)(acc);
}, 3, false, _curry.placeholder);

/**
 * @public @function reduceRight1
 * - reduceRight version of reduce1
 * - same as reduceRight except without needing an accumulator by passing the
 *   first element in the iteration as the accumulator
 *
 * @see @function reduce1
 * @see @function reduceRight
 */
var reduceRight1 = exports.reduceRight1 = (0, _curry.currify)(function (func, iterable) {
  if (!(0, _checks.isFunction)(func)) throw new TypeError("reduceRight1 cannot be applied without first specifying a function!");else if (!(0, _checks.isIterable)(iterable)) throw new TypeError("reduceRight1 cannot be applied on a non-iterable!");

  var last = { done: true, value: undefined };
  var proxy = regeneratorRuntime.mark(function proxy(iterable) {
    var iterator, item, prev;
    return regeneratorRuntime.wrap(function proxy$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            iterator = (0, _getIterator2.default)(iterable);
            item = iterator.next();

            if (!item.done) {
              _context.next = 6;
              break;
            }

            _context.next = 5;
            return item.value;

          case 5:
            return _context.abrupt("return");

          case 6:
            prev = iterator.next();

          case 7:
            if (prev.done) {
              _context.next = 14;
              break;
            }

            _context.next = 10;
            return item.value;

          case 10:
            item = prev;
            prev = iterator.next();
            _context.next = 7;
            break;

          case 14:
            last = item;

            return _context.abrupt("return");

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, proxy, this);
  });

  var f = _reduceR(func);
  var res = (0, _iterableReduce2.default)(f, _algebraic.identity, iterable, 0, proxy(iterable));
  if (last.done) throw new TypeError("Cannot reduceRight1 aganist empty iterables!");

  return res(last.value);
}, 2, false, _curry.placeholder);