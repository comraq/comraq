"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keep = exports.dedupe = exports.distinct = exports.remove = undefined;

var _checks = require("./../../utils/checks");

var _utils = require("./../../utils");

var _curry = require("./../curry");

var _iterables = require("./../iterables");

var _Transformer = require("./Transformer");

var _Transformer2 = _interopRequireDefault(_Transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [_filterGen, _removeGen, _distinctGen, _dedupeGen, _keepGen].map(regeneratorRuntime.mark);

/**
 * @public @function filter
 * - filter against a functor, a Monoid or an iterable collection
 *   by applying a predicate function against all elements of the iteration
 * - like other functions, this also passes the index and original iterable
 *   to the predicate function as the second and third argument
 *
 * @param {Function} predicate
 * - the predicate function applied against each element in the iterable
 *
 * @param {Transformer|Iterable|Monoid} target
 * - the target iterable/functor
 *
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a new iterable with all elements filtered and left out those
 *   that returned false when applied with the predicate function
 * - returns a lazy generator which will yield all elements from original
 *   sequence that returns true when applied with the predicate functon
 *
 * @throws TypeError
 * - predicate function is not a function
 */
exports.default = (0, _curry.currify)(function (predicate, target) {
  if (!(0, _checks.isFunction)(predicate)) throw new Error("filter cannot be applied without first specifying a predicate function!");

  if (!(0, _Transformer.isTransformer)(target)) return _filterGen(predicate, target);

  return (0, _Transformer2.default)(function (acc, next) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return predicate.apply(undefined, [next].concat(args)) ? _Transformer.step.apply(undefined, [target, acc, next].concat(args)) : acc;
  }, function (acc) {
    return (0, _Transformer.complete)(target, acc);
  }, function () {
    return (0, _Transformer.init)(target);
  });
}, 2, false, _curry.placeholder);

/**
 * @private @function _filterGen
 * - private version of filter returning a generator
 *
 * @see @function @filter
 *
 * @returns {Generator}
 * - a generator that will lazily yield only values in the sequence that
 *   returns true for the predicate filter
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */

function _filterGen(predicate, target) {
  var iterator, item, result, index;
  return regeneratorRuntime.wrap(function _filterGen$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if ((0, _checks.isIterable)(target)) {
            _context.next = 2;
            break;
          }

          throw new Error("Cannot filter over non-iterable " + target + "!");

        case 2:
          iterator = (0, _iterables.getIterator)(target);
          item = iterator.next(), result = void 0;
          index = 0;

        case 5:
          if (item.done) {
            _context.next = 17;
            break;
          }

          if (!predicate(item.value, index, target)) {
            _context.next = 12;
            break;
          }

          _context.next = 9;
          return item.value;

        case 9:
          result = _context.sent;
          _context.next = 13;
          break;

        case 12:
          result = undefined;

        case 13:
          item = iterator.next(result);

        case 14:
          ++index;
          _context.next = 5;
          break;

        case 17:
          return _context.abrupt("return");

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

/**
 * @public @function remove
 * - remove against a functor, a Monoid or an iterable collection
 *   by applying a predicate function against all elements of the iteration
 * - like other functions, this also passes the index and original iterable
 *   to the predicate function as the second and third argument
 *
 * @param {Function} predicate
 * - the predicate function applied against each element in the iterable
 *
 * @param {Transformer|Iterable|Monoid} target
 * - the target iterable/functor
 *
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a new iterable with all elements removed, leaving out those
 *   that returned true when applied with the predicate function
 *
 * @throws TypeError
 * - predicate function func is not a function
 */
var remove = exports.remove = (0, _curry.currify)(function (predicate, target) {
  if (!(0, _checks.isFunction)(predicate)) throw new Error("remove cannot be applied without first specifying a predicate function!");

  if (!(0, _Transformer.isTransformer)(target)) return _removeGen(predicate, target);

  return (0, _Transformer2.default)(function (acc, next) {
    for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }

    return predicate.apply(undefined, [next].concat(args)) ? acc : _Transformer.step.apply(undefined, [target, acc, next].concat(args));
  }, function (acc) {
    return (0, _Transformer.complete)(target, acc);
  }, function () {
    return (0, _Transformer.init)(target);
  });
}, 2, false, _curry.placeholder);

/**
 * @private @function _removeGen
 * - private verson of remove returning a generator
 *
 * @see @function @remove
 *
 * @returns {Generator}
 * - a generator that will lazily yield all values in the sequence that
 *   returns false when evaluated with the predicate
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */
function _removeGen(predicate, target) {
  var iterator, item, result, index;
  return regeneratorRuntime.wrap(function _removeGen$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if ((0, _checks.isIterable)(target)) {
            _context2.next = 2;
            break;
          }

          throw new Error("Cannot remove from non-iterable " + target + "!");

        case 2:
          iterator = (0, _iterables.getIterator)(target);
          item = iterator.next(), result = void 0;
          index = 0;

        case 5:
          if (item.done) {
            _context2.next = 17;
            break;
          }

          if (!predicate(item.value, index, target)) {
            _context2.next = 10;
            break;
          }

          result = undefined;

          _context2.next = 13;
          break;

        case 10:
          _context2.next = 12;
          return item.value;

        case 12:
          result = _context2.sent;

        case 13:

          item = iterator.next(result);

        case 14:
          ++index;
          _context2.next = 5;
          break;

        case 17:
          return _context2.abrupt("return");

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, _marked[1], this);
}

/**
 * @public @function distinct
 * - transforms a collection into a set by removing all second+ occurences
 *
 * @param {Transformer|Iterable|Monoid} target
 * - the target iterable/functor
 *
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a generator yielding all elements from iterable sequence filtered
 *   to only occur once, preserving the order of elements by its first
 *   occurence
 */
var distinct = exports.distinct = function distinct(target) {
  if (!(0, _Transformer.isTransformer)(target)) return _distinctGen(target);

  var set = new Set();
  return (0, _Transformer2.default)(function (acc, next) {
    for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
      args[_key3 - 2] = arguments[_key3];
    }

    if (set.has(next)) return acc;

    set.add(next);
    return _Transformer.step.apply(undefined, [target, acc, next].concat(args));
  }, function (acc) {
    return (0, _Transformer.complete)(target, acc);
  }, function () {
    return (0, _Transformer.init)(target);
  });
};

/**
 * @private @function _distinctGen
 * - private version of distinct returning a generator
 *
 * @see @function distinct
 *
 * @returns {Generator}
 * - a generator that will lazily yield all values in the sequence omitting
 *   any duplicates
 *
 * @throws TypeError
 * - target is not an iterable
 */
function _distinctGen(target) {
  var set, result, iterator, item;
  return regeneratorRuntime.wrap(function _distinctGen$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if ((0, _checks.isIterable)(target)) {
            _context3.next = 2;
            break;
          }

          throw new Error("Cannot get distinct elements of non-iterable " + target + "!");

        case 2:
          set = new Set();
          result = void 0;
          iterator = (0, _iterables.getIterator)(target);
          item = iterator.next();

        case 6:
          if (item.done) {
            _context3.next = 18;
            break;
          }

          if (set.has(item.value)) {
            _context3.next = 14;
            break;
          }

          _context3.next = 10;
          return item.value;

        case 10:
          result = _context3.sent;

          set.add(item.value);

          _context3.next = 15;
          break;

        case 14:
          result = undefined;

        case 15:
          item = iterator.next(result);
          _context3.next = 6;
          break;

        case 18:
          return _context3.abrupt("return");

        case 19:
        case "end":
          return _context3.stop();
      }
    }
  }, _marked[2], this);
}

/**
 * @public @function dedupe
 * - transforms a collection into a set by removing all consecutive
 *   duplicate occurences
 *
 * @param {Transformer|Iterable|Monoid} target
 * - the target iterable/functor
 *
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a generator yielding all elements from iterable sequence having
 *   consecutive duplicates removed to occur only once
 */
var dedupe = exports.dedupe = function dedupe(target) {
  if (!(0, _Transformer.isTransformer)(target)) return _dedupeGen(target);

  var prev = {};
  return (0, _Transformer2.default)(function (acc, next) {
    for (var _len4 = arguments.length, args = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
      args[_key4 - 2] = arguments[_key4];
    }

    if (next === prev) return acc;

    prev = next;
    return _Transformer.step.apply(undefined, [target, acc, next].concat(args));
  }, function (acc) {
    return (0, _Transformer.complete)(target, acc);
  }, function () {
    return (0, _Transformer.init)(target);
  });
};

/**
 * @private @function _dedupeGen
 * - private version of depdupe returning a generator
 *
 * @see @function dedupe
 *
 * @returns {Generator}
 * - a generator that will lazily yield all values in the sequence omitting
 *   any consecutive duplicates
 *
 * @throws TypeError
 * - target is not an iterable
 */
function _dedupeGen(target) {
  var result, prev, iterator, item;
  return regeneratorRuntime.wrap(function _dedupeGen$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if ((0, _checks.isIterable)(target)) {
            _context4.next = 2;
            break;
          }

          throw new Error("Cannot deduplicate elements of non-iterable " + target + "!");

        case 2:
          result = void 0;
          prev = {};
          iterator = (0, _iterables.getIterator)(target);
          item = iterator.next();

        case 6:
          if (item.done) {
            _context4.next = 18;
            break;
          }

          if (!(item.value !== prev)) {
            _context4.next = 14;
            break;
          }

          _context4.next = 10;
          return item.value;

        case 10:
          result = _context4.sent;

          prev = item.value;

          _context4.next = 15;
          break;

        case 14:
          result = undefined;

        case 15:
          item = iterator.next(result);
          _context4.next = 6;
          break;

        case 18:
          return _context4.abrupt("return");

        case 19:
        case "end":
          return _context4.stop();
      }
    }
  }, _marked[3], this);
}

/**
 * @public @function keep
 * - filter against a functor, a Monoid or an iterable collection
 *   by applying a predicate function against all elements of the
 *   iteration, keeping only those that return non-null and non-undefined
 *   values
 * - in addition, this also passes the index, original iterable and the number
 *   of times the predicate function to keep was called as the second and
 *   third, and fourth argument
 *
 * @param {Function} predicate
 * - the predicate function applied against each element in the iterable
 *
 * @param {Transformer|Iterable|Monoid} target
 * - the target iterable/functor
 *
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a generator yielding all elements from iterable sequence and leave
 *   out those that returned null or undefined when applied with the
 *   predicate function
 *
 * @throws TypeError
 * - predicate function func is not a function
 */
var keep = exports.keep = (0, _curry.currify)(function (predicate, target) {
  if (!(0, _checks.isFunction)(predicate)) throw new Error("keep cannot be applied without first specifying a predicate function!");

  if (!(0, _Transformer.isTransformer)(target)) return _keepGen(predicate, target);

  var i = 0;
  return (0, _Transformer2.default)(function (acc, next) {
    for (var _len5 = arguments.length, args = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
      args[_key5 - 2] = arguments[_key5];
    }

    var result = predicate.apply(undefined, [next].concat(args, [i++]));

    var type = _utils.types.toString(result);
    return type === _utils.types.sNull || type === _utils.types.sUndefined ? acc : _Transformer.step.apply(undefined, [target, acc, next].concat(args));
  }, function (acc) {
    return (0, _Transformer.complete)(target, acc);
  }, function () {
    return (0, _Transformer.init)(target);
  });
}, 2, false, _curry.placeholder);

/**
 * @private @function _keepGen
 * - private version of keep returning a generator
 *
 * @see @function keep
 *
 * @returns {Generator}
 * - a generator that will lazily yield all values in the sequence that
 *   returns a non-null or non-undefined value when applied with predicate
 *
 * @throws TypeError
 * - target is not an iterable
 */
function _keepGen(predicate, target) {
  var i = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
  var result, iterator, item, index, value, vType;
  return regeneratorRuntime.wrap(function _keepGen$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if ((0, _checks.isIterable)(target)) {
            _context5.next = 2;
            break;
          }

          throw new Error("Cannot keep elements of non-iterable " + target + "!");

        case 2:
          result = void 0;
          iterator = (0, _iterables.getIterator)(target);
          item = iterator.next();
          index = 0;

        case 6:
          if (item.done) {
            _context5.next = 20;
            break;
          }

          value = predicate(item.value, index, target, i++);
          vType = _utils.types.toString(value);

          if (!(vType === _utils.types.sNull || vType === _utils.types.sUndefined)) {
            _context5.next = 13;
            break;
          }

          result = undefined;

          _context5.next = 16;
          break;

        case 13:
          _context5.next = 15;
          return item.value;

        case 15:
          result = _context5.sent;

        case 16:

          item = iterator.next(result);

        case 17:
          ++i;
          _context5.next = 6;
          break;

        case 20:
          return _context5.abrupt("return");

        case 21:
        case "end":
          return _context5.stop();
      }
    }
  }, _marked[4], this);
}