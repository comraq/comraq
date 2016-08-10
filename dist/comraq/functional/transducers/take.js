"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.takeNth = exports.takeWhile = undefined;

var _checks = require("./../../utils/checks");

var _curry = require("./../curry");

var _iterables = require("./../iterables");

var _Reduced = require("./Reduced");

var _Transformer = require("./Transformer");

var _Transformer2 = _interopRequireDefault(_Transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [_takeGen, _takeWhileGen, __takeNthGen].map(regeneratorRuntime.mark);

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
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - a generator yielding the first 'total' number of elements from the target
 *   iterable or all elements if total number of elements <= 'number'
 *
 * @throws TypeError
 * - total number to take is not a number
 */
exports.default = (0, _curry.currify)(function (total, target) {
  if (!(0, _checks.isNumber)(total)) throw new TypeError("Cannot take elements with a non-number limit " + total + "!");else if (!(0, _Transformer.isTransformer)(target)) return _takeGen(total, target);

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
 * @private @function _takeGen
 * - private version of take returning a generator
 *
 * @see @function take
 *
 * @returns {Generator}
 * - a generator that will lazily yield the first num values from the
 *   iterable sequence
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */

function _takeGen(num, target) {
  var iterator, i, item, result;
  return regeneratorRuntime.wrap(function _takeGen$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if ((0, _checks.isIterable)(target)) {
            _context.next = 2;
            break;
          }

          throw new TypeError("Cannot take elements from non-iterable " + target + "!");

        case 2:
          iterator = (0, _iterables.getIterator)(target);
          i = 0;
          item = iterator.next();

        case 5:
          if (!(i++ < num && !item.done)) {
            _context.next = 12;
            break;
          }

          _context.next = 8;
          return item.value;

        case 8:
          result = _context.sent;

          item = iterator.next(result);
          _context.next = 5;
          break;

        case 12:
          return _context.abrupt("return");

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

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
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - a generator yielding values from the beginning of the iteration sequence
 *   while predicate holds true
 *
 * @throws TypeError
 * - predicate is not a function
 */
var takeWhile = exports.takeWhile = (0, _curry.currify)(function (predicate, target) {
  if (!(0, _checks.isFunction)(predicate)) throw new TypeError("Cannot takeWhile elements with non-function predicate " + predicate + "!");

  if (!(0, _Transformer.isTransformer)(target)) return _takeWhileGen(predicate, target);

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
 * @private @function _takeWhileGen
 * - private version of takeWhile returning a generator
 *
 * @see @function takeWhile
 *
 * @returns {Generator}
 * - a generator that will lazily yield values from the beginning of the
 *   sequence until predicate returns false when applied with value
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */
function _takeWhileGen(predicate, target) {
  var iterator, item, i, result;
  return regeneratorRuntime.wrap(function _takeWhileGen$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if ((0, _checks.isIterable)(target)) {
            _context2.next = 2;
            break;
          }

          throw new TypeError("Cannot takeWhile elements from non-iterable " + target + "!");

        case 2:
          iterator = (0, _iterables.getIterator)(target);
          item = iterator.next(), i = 0;

        case 4:
          if (!(predicate(item.value, i++, target) && !item.done)) {
            _context2.next = 11;
            break;
          }

          _context2.next = 7;
          return item.value;

        case 7:
          result = _context2.sent;

          item = iterator.next(result);
          _context2.next = 4;
          break;

        case 11:
          return _context2.abrupt("return");

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, _marked[1], this);
}

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
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - a generator yielding only every nth element starting from index start
 *   (start defaults to 0)
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

  if (!(0, _Transformer.isTransformer)(target)) return __takeNthGen(n, start, target);

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
 * @private @function __takeNthGen
 * - private version of _takeNth returning a generator
 *
 * @see @function _takeNth
 *
 * @returns {Generator}
 * - a generator that will lazily yield only every nth values in the
 *   original iterable sequence
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */
function __takeNthGen(n, start, target) {
  var iterator, current, i, started, item, result;
  return regeneratorRuntime.wrap(function __takeNthGen$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if ((0, _checks.isIterable)(target)) {
            _context3.next = 2;
            break;
          }

          throw new TypeError("Cannot takeNth elements from non-iterable " + target + "!");

        case 2:
          iterator = (0, _iterables.getIterator)(target);
          current = -1, i = 0, started = start < 0 ? true : false;
          item = iterator.next();
          result = void 0;

        case 6:
          if (item.done) {
            _context3.next = 27;
            break;
          }

          if (started) {
            _context3.next = 16;
            break;
          }

          if (!(i++ === start)) {
            _context3.next = 14;
            break;
          }

          started = true;
          current = start;
          _context3.next = 13;
          return item.value;

        case 13:
          result = _context3.sent;

        case 14:
          _context3.next = 24;
          break;

        case 16:
          if (!(++current - n === start)) {
            _context3.next = 23;
            break;
          }

          current = start;
          _context3.next = 20;
          return item.value;

        case 20:
          result = _context3.sent;
          _context3.next = 24;
          break;

        case 23:
          result = undefined;

        case 24:

          item = iterator.next(result);
          _context3.next = 6;
          break;

        case 27:
          return _context3.abrupt("return");

        case 28:
        case "end":
          return _context3.stop();
      }
    }
  }, _marked[2], this);
}