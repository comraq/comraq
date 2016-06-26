"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keep = exports.dedupe = exports.distinct = exports.remove = undefined;

var _checks = require("./../../utils/checks");

var _curry = require("./../curry");

var _algebraic = require("./../algebraic");

var _iterables = require("./../iterables");

var _concat = require("./concat");

var _Transformer = require("./Transformer");

var _Transformer2 = _interopRequireDefault(_Transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a new iterable with all elements filtered and left out those
 *   that returned false when applied with the predicate function
 *
 * @throws TypeError
 * - predicate function func is not a function
 */
exports.default = (0, _curry.currify)(function (predicate, target) {
  if (!(0, _checks.isFunction)(predicate)) throw new Error("filter cannot be applied without first specifying a predicate function!");

  if (!(0, _Transformer.isTransformer)(target)) return _filter(predicate, target);

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
 * @private @function _filter
 * - private version of filter that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 * - uses the iterables's reduce to carry out the filtering across
 *   all elements in the iterable
 *
 * @see @function filter
 * @see @function iterables/reduce
 */

var _filter = function _filter(predicate, target) {
  return (0, _iterables.reduce)(function (acc, next, index, target) {
    return predicate(next, index, target) ? (0, _concat.concatMutable)(next, acc) : acc;
  }, (0, _algebraic.empty)(target), target);
};

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

  if (!(0, _Transformer.isTransformer)(target)) return _remove(predicate, target);

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
 * @private @function _remove
 * - private version of remove that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 * - uses the iterables's reduce to carry out the removing across
 *   all elements in the iterable
 *
 * @see @function remove
 * @see @function iterables/reduce
 */
var _remove = function _remove(predicate, target) {
  return (0, _iterables.reduce)(function (acc, next, index, target) {
    return predicate(next, index, target) ? acc : (0, _concat.concatMutable)(next, acc);
  }, (0, _algebraic.empty)(target), target);
};

/**
 * @public @function distinct
 * - transforms a collection into a set by removing all second+ occurences
 *
 * @param {Transformer|Iterable|Monoid} target
 * - the target iterable/functor
 *
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a new iterable with all elements filtered to only occur once,
 *   preserving the order of elements by its first occurence
 */
var distinct = exports.distinct = function distinct(target) {
  if (!(0, _Transformer.isTransformer)(target)) return _distinct(target);

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
 * @private @function _distinct
 * - private version of distinct that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 *
 * @see @function distinct
 *
 * @throws TypeError
 * - target is not an iterable
 */
var _distinct = function _distinct(target) {
  if (!(0, _checks.isIterable)(target)) throw new Error("Cannot get distinct elements of non-iterable " + target + "!");

  var set = new Set();
  var result = (0, _algebraic.empty)(target);

  var iterator = (0, _iterables.getIterator)(target);
  var item = iterator.next();
  while (!item.done) {
    if (!set.has(item.value)) {
      result = (0, _concat.concatMutable)(item.value, result);
      set.add(item.value);
    }

    item = iterator.next();
  }

  return result;
};

/**
 * @public @function dedupe
 * - transforms a collection into a set by removing all consecutive
 *   duplicate occurences
 *
 * @param {Transformer|Iterable|Monoid} target
 * - the target iterable/functor
 *
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a new iterable with all elements having consecutive duplicates
 *   removed to occur only once
 */
var dedupe = exports.dedupe = function dedupe(target) {
  if (!(0, _Transformer.isTransformer)(target)) return _dedupe(target);

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
 * @private @function _dedupe
 * - private version of depdupe that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 *
 * @see @function dedupe
 *
 * @throws TypeError
 * - target is not an iterable
 */
var _dedupe = function _dedupe(target) {
  if (!(0, _checks.isIterable)(target)) throw new Error("Cannot deduplicate elements of non-iterable " + target + "!");

  var result = (0, _algebraic.empty)(target);
  var prev = {};

  var iterator = (0, _iterables.getIterator)(target);
  var item = iterator.next();
  while (!item.done) {
    if (item.value !== prev) {
      result = (0, _concat.concatMutable)(item.value, result);
      prev = item.value;
    }

    item = iterator.next();
  }

  return result;
};

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
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a new iterable with all elements filtered and left out those
 *   that returned null or undefined when applied with the predicate function
 *
 * @throws TypeError
 * - predicate function func is not a function
 */
var keep = exports.keep = (0, _curry.currify)(function (predicate, target) {
  if (!(0, _checks.isFunction)(predicate)) throw new Error("keep cannot be applied without first specifying a predicate function!");

  if (!(0, _Transformer.isTransformer)(target)) return _keep(predicate, target);

  var i = 0;
  return (0, _Transformer2.default)(function (acc, next) {
    for (var _len5 = arguments.length, args = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
      args[_key5 - 2] = arguments[_key5];
    }

    var result = predicate.apply(undefined, [next].concat(args, [i++]));

    return (0, _checks.isNull)(result) || (0, _checks.isUndefined)(result) ? acc : _Transformer.step.apply(undefined, [target, acc, next].concat(args));
  }, function (acc) {
    return (0, _Transformer.complete)(target, acc);
  }, function () {
    return (0, _Transformer.init)(target);
  });
}, 2, false, _curry.placeholder);

/**
 * @private @function _keep
 * - private version of keep that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 * - uses the iterables's reduce to carry out the filtering across
 *   all elements in the iterable
 *
 * @see @function keep
 * @see @function iterables/reduce
 */
var _keep = function _keep(predicate, target) {
  var i = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
  return (0, _iterables.reduce)(function (acc, next, index, target) {
    var result = predicate(next, index, target, i++);

    return (0, _checks.isNull)(result) || (0, _checks.isUndefined)(result) ? acc : (0, _concat.concatMutable)(next, acc);
  }, (0, _algebraic.empty)(target), target);
};