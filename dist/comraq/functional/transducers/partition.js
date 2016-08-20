"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.partitionBy = exports.partitionAll = undefined;

var _checks = require("./../../utils/checks");

var _library = require("./../library");

var _iterables = require("./../iterables");

var _strings = require("./../strings");

var _arrays = require("./../arrays");

var _Reduced = require("./Reduced");

var _Transformer = require("./Transformer");

var _Transformer2 = _interopRequireDefault(_Transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [_partitionAllGen, _partitionByGen].map(regeneratorRuntime.mark);

/**
 * @public @function partitionAll
 * - partitions an iterable into many smaller iterables as specified by size
 *
 * @param {Number} size
 * - the size/number of elements in each partition
 *
 * @param {Transformer|Iterable} target
 * - the target transformer or iterable
 *
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - a generator yielding partitions each of 'size' number of iterables,
 *   last partition may be smaller than 'size' if target iterable's total
 *   number of elements is not divisible by size
 *
 * @throws TypeError
 * - size of each partition is not a number
 */
var partitionAll = exports.partitionAll = (0, _library.currify)(function (size, target) {
  if (!(0, _checks.isNumber)(size)) throw new TypeError("Cannot partitionAll with a non-number " + size + "!");else if (!(0, _Transformer.isTransformer)(target)) return _partitionAllGen(size, target);

  // Partition is undefined for now as we currently have no access to the
  // unit/void/empty instance of the accumulator until the step function of
  // the transformer is actually called
  var count = 0,
      partition = undefined;

  return (0, _Transformer2.default)(function (acc, next) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    partition = (0, _checks.isUndefined)(partition) ? (0, _library.empty)(acc) : partition;

    if (count++ < size) partition = (0, _arrays.pushMutable)(next, partition);else {
      var temp = partition;
      count = 1;
      partition = (0, _arrays.pushMutable)(next, (0, _library.empty)(acc));
      return _Transformer.step.apply(undefined, [target, acc, temp].concat(args));
    }

    return acc;
  }, function (acc) {
    if (!(0, _checks.isUndefined)(partition) && (0, _strings.length)(partition) > 0) acc = (0, _Reduced.ensureUnreduced)((0, _Transformer.step)(target, acc, partition));

    return (0, _Transformer.complete)(target, acc);
  }, function () {
    return (0, _Transformer.init)(target);
  });
}, 2, false, _library.placeholder);

/**
 * @private @function _partitionAllGen
 * - private version of partitionAll returning a generator
 *
 * @see @function partitionAll
 *
 * @returns {Generator}
 * - a generator that will lazily yield all values in the sequence in
 *   partitions specified by size
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */
function _partitionAllGen(size, target) {
  var count, partition, iterator, result, item;
  return regeneratorRuntime.wrap(function _partitionAllGen$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if ((0, _checks.isIterable)(target)) {
            _context.next = 2;
            break;
          }

          throw new TypeError("Cannot partitionAll of non-iterable " + target + "!");

        case 2:
          count = 0, partition = (0, _library.empty)(target);
          iterator = (0, _iterables.getIterator)(target);
          result = void 0;
          item = iterator.next();

        case 6:
          if (item.done) {
            _context.next = 19;
            break;
          }

          if (!(count++ < size)) {
            _context.next = 11;
            break;
          }

          partition = (0, _arrays.pushMutable)(item.value, partition);

          _context.next = 16;
          break;

        case 11:
          _context.next = 13;
          return partition;

        case 13:
          result = _context.sent;

          count = 1;
          partition = (0, _arrays.pushMutable)(item.value, (0, _library.empty)(target));

        case 16:

          item = iterator.next(result);
          _context.next = 6;
          break;

        case 19:
          if (!((0, _strings.length)(partition) > 0)) {
            _context.next = 22;
            break;
          }

          _context.next = 22;
          return partition;

        case 22:
          return _context.abrupt("return");

        case 23:
        case "end":
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

/**
 * @public @function partitionBy
 * - partitions an iterable into many smaller iterables divided by everytime
 *   predicate returns a new value
 * - like other functions, this also passes the index and original iterable
 *   to the predicate function as the second and third argument
 *
 * @param {Function} predicate
 * - the predicate function to check on each element in iterable
 *
 * @param {Transformer|Iterable} target
 * - the target transformer or iterable
 *
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - generator yielding partitions of elements divided by when predicate
 *   function returns a different value
 *
 * @throws TypeError
 * - predicate argument is not a function
 */
var partitionBy = exports.partitionBy = (0, _library.currify)(function (predicate, target) {
  if (!(0, _checks.isFunction)(predicate)) throw new TypeError("Cannot partitionBy with non-function " + predicate + "!");else if (!(0, _Transformer.isTransformer)(target)) return _partitionByGen(predicate, target);

  // Partition is undefined for now as we currently have no access to the
  // unit/void/empty instance of the accumulator until the step function of
  // the transformer is actually called
  var val = undefined,
      partition = undefined;

  return (0, _Transformer2.default)(function (acc, next) {
    for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }

    var nextVal = predicate.apply(undefined, [next].concat(args));

    if ((0, _checks.isUndefined)(partition)) {
      partition = (0, _arrays.pushMutable)(next, (0, _library.empty)(acc));
      val = nextVal;
      return acc;
    }

    if (val === nextVal) {
      partition = (0, _arrays.pushMutable)(next, partition);
    } else {
      var temp = partition;
      partition = (0, _arrays.pushMutable)(next, (0, _library.empty)(acc));
      val = nextVal;
      return _Transformer.step.apply(undefined, [target, acc, temp].concat(args));
    }

    return acc;
  }, function (acc) {
    if (!(0, _checks.isUndefined)(partition) && (0, _strings.length)(partition) > 0) acc = (0, _Reduced.ensureUnreduced)((0, _Transformer.step)(target, acc, partition));

    return (0, _Transformer.complete)(target, acc);
  }, function () {
    return (0, _Transformer.init)(target);
  });
}, 2, false, _library.placeholder);

/**
 * @private @function _partitionByGen
 * - private version of partitionBy returning a generator
 *
 * @see @function partitionBy
 *
 * @returns {Generator}
 * - a generator that will lazily yield all values in the sequence separated
 *   into partitions every time predicate function returns a different value
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */
function _partitionByGen(predicate, target) {
  var iterator, item, val, partition, result, index, nextVal;
  return regeneratorRuntime.wrap(function _partitionByGen$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if ((0, _checks.isIterable)(target)) {
            _context2.next = 2;
            break;
          }

          throw new TypeError("Cannot partitionAll of non-iterable " + target + "!");

        case 2:
          iterator = (0, _iterables.getIterator)(target);
          item = iterator.next();
          val = void 0, partition = void 0, result = void 0;
          index = 0;

        case 6:
          if (item.done) {
            _context2.next = 26;
            break;
          }

          nextVal = predicate(item.value, index, target);

          if (!(index === 0)) {
            _context2.next = 13;
            break;
          }

          partition = (0, _arrays.pushMutable)(item.value, (0, _library.empty)(target));
          val = nextVal;

          _context2.next = 22;
          break;

        case 13:
          if (!(val === nextVal)) {
            _context2.next = 17;
            break;
          }

          partition = (0, _arrays.pushMutable)(item.value, partition);

          _context2.next = 22;
          break;

        case 17:
          _context2.next = 19;
          return partition;

        case 19:
          result = _context2.sent;

          partition = (0, _arrays.pushMutable)(item.value, (0, _library.empty)(target));
          val = nextVal;

        case 22:

          item = iterator.next(result);

        case 23:
          ++index;
          _context2.next = 6;
          break;

        case 26:
          if ((0, _checks.isUndefined)(partition)) {
            _context2.next = 29;
            break;
          }

          _context2.next = 29;
          return partition;

        case 29:
          return _context2.abrupt("return");

        case 30:
        case "end":
          return _context2.stop();
      }
    }
  }, _marked[1], this);
}