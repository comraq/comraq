"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.takeNth = exports.takeWhile = undefined;

var _checks = require("./../../utils/checks");

var _curry = require("./../curry");

var _iterables = require("./../iterables");

var _algebraic = require("./../algebraic");

var _concat = require("./concat");

var _Reduced = require("./Reduced");

var _Transformer = require("./Transformer");

var _Transformer2 = _interopRequireDefault(_Transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @public @function take
 * - gets the first 'number' of elements from an iterable specified
 *   by num
 * 
 * @param {Number} total
 * - the count of elements to take from iterable
 *
 * @param {Transformer|Iterable} target
 * - the target transformer or iterable
 *
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - an iterable with the first 'total' number of elements from the target
 *   iterable or all elements if total number of elements <= 'number'
 *
 * @throws TypeError
 * - total number to take is not a number
 */
exports.default = (0, _curry.currify)(function (total, target) {
  if (!(0, _checks.isNumber)(total)) throw new TypeError("Cannot take elements with a non-number limit " + total + "!");else if (!(0, _Transformer.isTransformer)(target)) return _take(total, target);

  var count = 0;

  return (0, _Transformer2.default)(function (acc, next) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    if (++count < total) return _Transformer.step.apply(undefined, [target, acc, next].concat(args));else if (count === total) return (0, _Reduced.ensureReduced)(_Transformer.step.apply(undefined, [target, acc, next].concat(args)));

    return (0, _Reduced.ensureReduced)(acc);
  }, function (acc) {
    return (0, _Transformer.complete)(target, acc);
  }, function () {
    return (0, _Transformer.init)(target);
  });
}, 2, false, _curry.placeholder);

/**
 * @private @function _take
 * - private version of take that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 *
 * @see @function take
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */

var _take = function _take(num, target) {
  if (!(0, _checks.isIterable)(target)) throw new TypeError("Cannot take elements from non-iterable " + target + "!");

  var iterator = (0, _iterables.getIterator)(target);
  var result = (0, _algebraic.empty)(target);

  var i = 0;
  var item = iterator.next();
  while (i++ < num && !item.done) {
    result = (0, _concat.concatMutable)(item.value, result);
    item = iterator.next();
  }

  return result;
};

/**
 * @public @function takeWhile
 * - gets elements from the beginning of an iterable while the predicate
 *   holds true
 * - like other functions, this also passes the index and original iterable
 *   to the predicate function as the second and third argument
 * 
 * @param {Function} predicate
 * - the predicate function returning a Boolean value that is applied
 *   against the elements within the iterable
 *
 * @param {Transformer|Iterable} target
 * - the target transformer or iterable
 *
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - if target is an iterable, returns an iterable from the beginning of the
 *   iteration sequence while predicate holds true
 *
 * @throws TypeError
 * - predicate is not a function
 */
var takeWhile = exports.takeWhile = (0, _curry.currify)(function (predicate, target) {
  if (!(0, _checks.isFunction)(predicate)) throw new TypeError("Cannot takeWhile elements with non-function predicate " + predicate + "!");

  if (!(0, _Transformer.isTransformer)(target)) return _takeWhile(predicate, target);

  return (0, _Transformer2.default)(function (acc, next) {
    for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }

    if (predicate.apply(undefined, [next].concat(args))) return _Transformer.step.apply(undefined, [target, acc, next].concat(args));

    return (0, _Reduced.ensureReduced)(acc);
  }, function (acc) {
    return (0, _Transformer.complete)(target, acc);
  }, function () {
    return (0, _Transformer.init)(target);
  });
}, 2, false, _curry.placeholder);

/**
 * @private @function _takeWhile
 * - private version of takeWhile that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 *
 * @see @function takeWhile
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */
var _takeWhile = function _takeWhile(predicate, target) {
  if (!(0, _checks.isIterable)(target)) throw new TypeError("Cannot takeWhile elements from non-iterable " + target + "!");

  var iterator = (0, _iterables.getIterator)(target);
  var result = (0, _algebraic.empty)(target);

  var item = iterator.next(),
      i = 0;
  while (predicate(item.value, i++, target) && !item.done) {
    result = (0, _concat.concatMutable)(item.value, result);
    item = iterator.next();
  }

  return result;
};

/**
 * @public @function takeNth
 * - gets every nth element from of an iterable specified by
 *   a numerical starting posiiton/index
 * 
 * @param {Number} n
 * - the number of elements to skip before taking from the iterable, must be
 *   positive ( n >= 0 )
 *
 * @param {Number} start (optional)
 * - the starting position/index of the iterable to take from (inclusive)
 * - start = 0, --> (default) starts and takes the 0th element from the iterable
 * - start < 0, --> starts from the negative value, skipping every n
 *                  elements, and only begin taking element when index becomes
 *                  positive
 * - start > 0, --> skips all elements from the head of the iterable
 *                  sequence and starts by taking the start-th element, then
 *                  skipping every n elements
 * - @example
 *   let arr = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l" ];
 *
 *   // Take every 5th starting with 0th
 *   takeNth(5, arr)        --> [ "a", "f", "k" ];
 *
 *   // Take every 5th starting with -1st
 *   takeNth(5, -1)(arr)    --> [ "e", "j" ];
 *
 *   // Take every 3rd starting with -2nd
 *   takeNth(3, -2)(arr)    --> [ "b", "e", "h", "k" ];
 *
 *   // Take every 3rd starting with -2nd
 *   takeNth(3, 3)(arr)     --> [ "d", "g", "j" ];
 *
 *    // Take every 100th elements -> should be empty
 *   takeNth(100, -2)(arr)  --> [];
 *
 *   // Take every 1th elements -> should be same as original
 *   takeNth(1)(arr)        --> arr; 
 *
 * @param {Transformer|Iterable} target
 * - the target transformer or iterable
 *
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - if target is an iterable, returns an iterable with only every nth
 *   element starting from index start (start defaults to 0)
 */
var takeNth = exports.takeNth = (0, _curry.currify)(function (n, start, target) {
  if ((0, _checks.isIterable)(start) || (0, _Transformer.isTransformer)(start)) return _takeNth(n, 0, start);

  if (arguments.length > 2) return _takeNth(n, start, target);

  return function (target) {
    return _takeNth(n, start, target);
  };
}, 2, false, _curry.placeholder);

/*
 * @private @function _takeNth
 * - private helper/repeated function of takeNth that returns the
 *   Transformer if target is of type transformer
 * - otherwise, the result is returned by __takeNth
 *
 * @see @public @function takeNth
 * @see @private @function __takeNth
 *
 * @throws TypeError
 * - n is a negative number
 * - start is not a number
 */
var _takeNth = function _takeNth(n, start, target) {
  if (!(0, _checks.isNumber)(n) || n <= 0) throw new TypeError("Cannot takeNth elements with an invalid n: '" + n + "'!");else if (!(0, _checks.isNumber)(start)) throw new TypeError("Second argument to takeNth must be a starting index number, " + "transformer or iterable!");

  if (start < 0) start %= n;

  if (!(0, _Transformer.isTransformer)(target)) return __takeNth(n, start, target);

  var current = -1,
      i = 0,
      started = start < 0 ? true : false;
  return (0, _Transformer2.default)(function (acc, next) {
    for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
      args[_key3 - 2] = arguments[_key3];
    }

    if (!started) {
      if (i++ === start) {
        started = true;
        current = start;
        return _Transformer.step.apply(undefined, [target, acc, next].concat(args));
      }

      return acc;
    }

    if (++current - n === start) {
      current = start;
      return _Transformer.step.apply(undefined, [target, acc, next].concat(args));
    }

    return acc;
  }, function (acc) {
    return (0, _Transformer.complete)(target, acc);
  }, function () {
    return (0, _Transformer.init)(target);
  });
};

/**
 * @private @function __takeNth
 * - private version of _takeNth that immediately returns the iterable
 *   result when the iterable is passed instead of a transformer mixin
 *
 * @see @function _takeNth
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */
var __takeNth = function __takeNth(n, start, target) {
  if (!(0, _checks.isIterable)(target)) throw new TypeError("Cannot takeNth elements from non-iterable " + target + "!");

  var iterator = (0, _iterables.getIterator)(target);
  var result = (0, _algebraic.empty)(target);

  var current = -1,
      i = 0,
      started = start < 0 ? true : false;
  var item = iterator.next();
  while (!item.done) {
    if (!started) {
      if (i++ === start) {
        started = true;
        current = start;
        result = (0, _concat.concatMutable)(item.value, result);
      }
    } else {
      if (++current - n === start) {
        current = start;
        result = (0, _concat.concatMutable)(item.value, result);
      }
    }
    item = iterator.next();
  }

  return result;
};