"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dropWhile = undefined;

var _checks = require("./../../utils/checks");

var _curry = require("./../curry");

var _iterables = require("./../iterables");

var _algebraic = require("./../algebraic");

var _concat = require("./concat");

var _Transformer = require("./Transformer");

var _Transformer2 = _interopRequireDefault(_Transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @public @function drop
 * - drops the first 'number' of elements from an iterable specified
 *   by num and returns the rest
 * 
 * @param {Number} total
 * - the count of elements to drop from iterable
 *
 * @param {Transformer|Iterable} target
 * - the target transformer or iterable
 *
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - an iterable without the first 'total' number of elements from the target
 *   iterable or all elements if total number of elements <= 'number'
 *
 * @throws TypeError
 * - total number to take is not a number
 */
exports.default = (0, _curry.currify)(function (total, target) {
  if (!(0, _checks.isNumber)(total)) throw new TypeError("Cannot drop elements with a non-number limit " + total + "!");else if (!(0, _Transformer.isTransformer)(target)) return _drop(total, target);

  var count = 0;

  return (0, _Transformer2.default)(function (acc, next) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    if (++count <= total) return acc;

    return _Transformer.step.apply(undefined, [target, acc, next].concat(args));
  }, function (acc) {
    return (0, _Transformer.complete)(target, acc);
  }, function () {
    return (0, _Transformer.init)(target);
  });
}, 2, false, _curry.placeholder);

/**
 * @private @function _drop
 * - private version of drop that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 *
 * @see @function drop
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */

var _drop = function _drop(num, target) {
  if (!(0, _checks.isIterable)(target)) throw new TypeError("Cannot drop elements from non-iterable " + target + "!");

  var iterator = (0, _iterables.getIterator)(target);
  var result = (0, _algebraic.empty)(target);

  var i = 0;
  var item = iterator.next();

  while (++i <= num) {
    item = iterator.next();
  }while (!item.done) {
    result = (0, _concat.concatMutable)(item.value, result);
    item = iterator.next();
  }

  return result;
};

/**
 * @public @function dropWhile
 * - drops elements from the beginning of an iterable while the predicate
 *   holds true and returns the remaining of the elements in the iterable
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
 * - if target is an iterable, returns an iterable without the beginning
 *   iteration sequence while predicate holds true
 *
 * @throws TypeError
 * - predicate is not a function
 */
var dropWhile = exports.dropWhile = (0, _curry.currify)(function (predicate, target) {
  if (!(0, _checks.isFunction)(predicate)) throw new TypeError("Cannot dropWhile elements with non-function predicate " + predicate + "!");

  if (!(0, _Transformer.isTransformer)(target)) return _dropWhile(predicate, target);

  var dropped = false;
  return (0, _Transformer2.default)(function (acc, next) {
    for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }

    if (!dropped && predicate.apply(undefined, [next].concat(args))) return acc;

    dropped = true;
    return _Transformer.step.apply(undefined, [target, acc, next].concat(args));
  }, function (acc) {
    return (0, _Transformer.complete)(target, acc);
  }, function () {
    return (0, _Transformer.init)(target);
  });
}, 2, false, _curry.placeholder);

/**
 * @private @function _dropWhile
 * - private version of dropWhile that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 *
 * @see @function dropWhile
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */
var _dropWhile = function _dropWhile(predicate, target) {
  if (!(0, _checks.isIterable)(target)) throw new TypeError("Cannot dropWhile elements from non-iterable " + target + "!");

  var iterator = (0, _iterables.getIterator)(target);
  var result = (0, _algebraic.empty)(target);

  var item = iterator.next(),
      i = 0;
  while (predicate(item.value, i++, target) && !item.done) {
    item = iterator.next();
  }while (!item.done) {
    result = (0, _concat.concatMutable)(item.value, result);
    item = iterator.next();
  }

  return result;
};