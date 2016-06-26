"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.partitionBy = exports.partitionAll = undefined;

var _checks = require("./../../utils/checks");

var _curry = require("./../curry");

var _iterables = require("./../iterables");

var _algebraic = require("./../algebraic");

var _strings = require("./../strings");

var _concat = require("./concat");

var _Reduced = require("./Reduced");

var _Transformer = require("./Transformer");

var _Transformer2 = _interopRequireDefault(_Transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - an iterable with partitions each of 'size' number of iterables,
 *   last partition may be smaller than 'size' if target iterable's total
 *   number of elements is not divisible by size
 *
 * @throws TypeError
 * - size of each partition is not a number
 */
var partitionAll = exports.partitionAll = (0, _curry.currify)(function (size, target) {
  if (!(0, _checks.isNumber)(size)) throw new TypeError("Cannot partitionAll with a non-number " + size + "!");else if (!(0, _Transformer.isTransformer)(target)) return _partitionAll(size, target);

  // Partition is undefined for now as we currently have no access to the
  // unit/void/empty instance of the accumulator until the step function of
  // the transformer is actually called
  var count = 0,
      partition = undefined;

  return (0, _Transformer2.default)(function (acc, next) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    partition = (0, _checks.isUndefined)(partition) ? (0, _algebraic.empty)(acc) : partition;

    if (count++ < size) partition = (0, _concat.concatMutable)(next, partition);else {
      var temp = partition;
      count = 1;
      partition = (0, _concat.concatMutable)(next, (0, _algebraic.empty)(acc));
      return _Transformer.step.apply(undefined, [target, acc, temp].concat(args));
    }

    return acc;
  }, function (acc) {
    if (!(0, _checks.isUndefined)(partition) && (0, _strings.length)(partition) > 0) acc = (0, _Reduced.ensureUnreduced)((0, _Transformer.step)(target, acc, partition));

    return (0, _Transformer.complete)(target, acc);
  }, function () {
    return (0, _Transformer.init)(target);
  });
}, 2, false, _curry.placeholder);

/**
 * @private @function _partitionAll
 * - private version of partitionAll that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 *
 * @see @function partitionAll
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */
var _partitionAll = function _partitionAll(size, target) {
  if (!(0, _checks.isIterable)(target)) throw new TypeError("Cannot partitionAll of non-iterable " + target + "!");

  var count = 0,
      partition = (0, _algebraic.empty)(target);

  var iterator = (0, _iterables.getIterator)(target);
  var result = (0, _algebraic.empty)(target);

  var item = iterator.next();
  while (!item.done) {
    if (count++ < size) partition = (0, _concat.concatMutable)(item.value, partition);else {
      var temp = partition;
      count = 1;
      partition = (0, _concat.concatMutable)(item.value, (0, _algebraic.empty)(target));
      target = (0, _concat.concatMutable)(temp, result);
    }

    item = iterator.next();
  }

  if ((0, _strings.length)(partition) > 0) result = (0, _concat.concatMutable)(partition, result);

  return result;
};

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
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - an iterable with partitions of elements divided by when predicate
 *   function returns a different value, 
 *
 * @throws TypeError
 * - predicate argument is not a function
 */
var partitionBy = exports.partitionBy = (0, _curry.currify)(function (predicate, target) {
  if (!(0, _checks.isFunction)(predicate)) throw new TypeError("Cannot partitionBy with non-function " + predicate + "!");else if (!(0, _Transformer.isTransformer)(target)) return _partitionBy(predicate, target);

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
      partition = (0, _concat.concatMutable)(next, (0, _algebraic.empty)(acc));
      val = nextVal;
      return acc;
    }

    if (val === nextVal) {
      partition = (0, _concat.concatMutable)(next, partition);
    } else {
      var temp = partition;
      partition = (0, _concat.concatMutable)(next, (0, _algebraic.empty)(acc));
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
}, 2, false, _curry.placeholder);

/**
 * @private @function _partitionBy
 * - private version of partitionBy that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 *
 * @see @function partitionBy
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */
var _partitionBy = function _partitionBy(predicate, target) {
  if (!(0, _checks.isIterable)(target)) throw new TypeError("Cannot partitionAll of non-iterable " + target + "!");

  var val = undefined,
      partition = undefined;
  return (0, _iterables.reduce)(function (acc, next, i, coll) {
    var nextVal = predicate(next, i, coll);
    if ((0, _checks.isUndefined)(partition)) {
      partition = (0, _concat.concatMutable)(next, (0, _algebraic.empty)(coll));
      val = nextVal;
      return acc;
    }

    if (val === nextVal) partition = (0, _concat.concatMutable)(next, partition);else {
      var temp = partition;
      partition = (0, _concat.concatMutable)(next, (0, _algebraic.empty)(coll));
      acc = (0, _concat.concatMutable)(temp, acc);
      val = nextVal;
    }

    if (i === (0, _strings.length)(coll) - 1 && !(0, _checks.isUndefined)(partition)) acc = (0, _concat.concatMutable)(partition, acc);

    return acc;
  }, (0, _algebraic.empty)(target), target);
};