"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports._mapGen = _mapGen;

var _checks = require("./../../utils/checks");

var _types = require("./../../utils/types");

var _library = require("./../library");

var _iterables = require("./../iterables");

var _Transformer = require("./Transformer");

var _Transformer2 = _interopRequireDefault(_Transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [_mapGen].map(regeneratorRuntime.mark);

/**
 * @public @function map
 * - map a function against a functor, a Monoid
 *   or all elements of an iterable collection
 * - in addition, this also passes the index, original iterable and the number
 *   of times the predicate function to keep was called as the second and
 *   third, and fourth argument
 *
 * @param {Function} func
 * - the mapping function applied against each element in the iterable
 *
 * @param {Transformer|Iterable|Functor|Monoid} target
 * - the transformer or target iterable/functor
 *
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a lazy generator which will yield all elements
 *   applied with the mapping functon
 *
 * @throws TypeError
 * - mapping function func is not a function
 */
exports.default = (0, _library.curry)(function (func, target) {
  if ((typeof func === "undefined" ? "undefined" : _typeof(func)) !== _types.pFunction) throw new TypeError("map cannot be applied without first specifying a function!");

  if (!(0, _Transformer.isTransformer)(target)) return _mapGen(func, target);

  var i = 0;
  return (0, _Transformer2.default)(function (acc, next) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return _Transformer.step.apply(undefined, [target, acc, func.apply(undefined, [next].concat(args, [i++]))].concat(args));
  }, function (acc) {
    return (0, _Transformer.complete)(target, acc);
  }, function () {
    return (0, _Transformer.init)(target);
  });
}, 2, _library.placeholder);

/**
 * @private @function _mapGen
 * - private verson of map returning a generator
 *
 * @see @function @map
 *
 * @returns {Generator}
 * - a generator that will lazily yield all values in the sequence after
 *   applying the mapping function
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */

function _mapGen(func, target) {
  var i = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
  var iterator, item, index, result;
  return regeneratorRuntime.wrap(function _mapGen$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if ((0, _checks.isIterable)(target)) {
            _context.next = 2;
            break;
          }

          throw new Error("Cannot map over non-iterable " + target + "!");

        case 2:
          iterator = (0, _iterables.getIterator)(target);
          item = iterator.next();
          index = 0;

        case 5:
          if (item.done) {
            _context.next = 13;
            break;
          }

          _context.next = 8;
          return func(item.value, index, target, i++);

        case 8:
          result = _context.sent;

          item = iterator.next(result);

        case 10:
          ++index;
          _context.next = 5;
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