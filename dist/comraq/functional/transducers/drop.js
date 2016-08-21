"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dropWhile = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _checks = require("./../../utils/checks");

var _types = require("./../../utils/types");

var _library = require("./../library");

var _iterables = require("./../iterables");

var _Transformer = require("./Transformer");

var _Transformer2 = _interopRequireDefault(_Transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [_dropGen, _dropWhileGen].map(regeneratorRuntime.mark);

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
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - a generator yielding elements without the first 'total' number of elements
 *   from the target iterable or all elements if total number of elements <=
 *   'number'
 *
 * @throws TypeError
 * - total number to take is not a number
 */
exports.default = (0, _library.curry)(function (total, target) {
  if ((typeof total === "undefined" ? "undefined" : _typeof(total)) !== _types.pNumber) throw new TypeError("Cannot drop elements with a non-number limit " + total + "!");else if (!(0, _Transformer.isTransformer)(target)) return _dropGen(total, target);

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
}, 2, _library.placeholder);

/**
 * @private @function _dropGen
 * - private version of drop returning a generator
 *
 * @see @function drop
 *
 * @returns {Generator}
 * - a generator that will lazily yield all values from iterable sequence
 *   after omitting the first 'num' number of elements
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */

function _dropGen(num, target) {
  var iterator, i, item, result;
  return regeneratorRuntime.wrap(function _dropGen$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if ((0, _checks.isIterable)(target)) {
            _context.next = 2;
            break;
          }

          throw new TypeError("Cannot drop elements from non-iterable " + target + "!");

        case 2:
          iterator = (0, _iterables.getIterator)(target);
          i = 0;
          item = iterator.next();


          while (++i <= num) {
            item = iterator.next();
          }

        case 6:
          if (item.done) {
            _context.next = 13;
            break;
          }

          _context.next = 9;
          return item.value;

        case 9:
          result = _context.sent;

          item = iterator.next(result);
          _context.next = 6;
          break;

        case 13:
          return _context.abrupt("return");

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

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
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - a generator yielding elements without the beginning
 *   iteration sequence while predicate holds true
 *
 * @throws TypeError
 * - predicate is not a function
 */
var dropWhile = exports.dropWhile = (0, _library.curry)(function (predicate, target) {
  if ((typeof predicate === "undefined" ? "undefined" : _typeof(predicate)) !== _types.pFunction) throw new TypeError("Cannot dropWhile elements with non-function predicate " + predicate + "!");

  if (!(0, _Transformer.isTransformer)(target)) return _dropWhileGen(predicate, target);

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
}, 2, _library.placeholder);

/**
 * @private @function _dropWhileGen
 * - private version of dropWhile returning a generator
 *
 * @see @function dropWhile
 *
 * @returns {Generator}
 * - a generator that will lazily yield only values from iterable sequence
 *   after predicate evaluates to false
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */
function _dropWhileGen(predicate, target) {
  var iterator, item, i, result;
  return regeneratorRuntime.wrap(function _dropWhileGen$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if ((0, _checks.isIterable)(target)) {
            _context2.next = 2;
            break;
          }

          throw new TypeError("Cannot dropWhile elements from non-iterable " + target + "!");

        case 2:
          iterator = (0, _iterables.getIterator)(target);
          item = iterator.next(), i = 0;

          while (predicate(item.value, i++, target) && !item.done) {
            item = iterator.next();
          }

        case 5:
          if (item.done) {
            _context2.next = 12;
            break;
          }

          _context2.next = 8;
          return item.value;

        case 8:
          result = _context2.sent;

          item = iterator.next(result);
          _context2.next = 5;
          break;

        case 12:
          return _context2.abrupt("return");

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, _marked[1], this);
}