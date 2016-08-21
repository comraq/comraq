"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _checks = require("./../../utils/checks");

var _types = require("./../../utils/types");

var _library = require("./../library");

var _iterables = require("./../iterables");

var _Transformer = require("./Transformer");

var _Transformer2 = _interopRequireDefault(_Transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [_randomGen].map(regeneratorRuntime.mark);

/**
 * @public @function random
 * - takes a floating point probability number between 0.0 - 1.0 and an
 *   iterable collection, then returns a subset of the collection with the
 *   given probability
 *
 * @param {Number} prob
 * - the floating point probability
 *
 * @param {Transformer|Iterable} target
 * - the transformer or target iterable
 *
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a new iterable with elements each with probability of prob to
 *   to exist
 *
 * @throws TypeError
 * - prob is not a valid number between 0.0 - 1.0 (inclusive)
 */
exports.default = (0, _library.curry)(function (prob, target) {
  if ((typeof prob === "undefined" ? "undefined" : _typeof(prob)) !== _types.pNumber || prob < 0 || prob > 1) throw new TypeError("random cannot be applied with invalid probability " + prob + "!");

  if (!(0, _Transformer.isTransformer)(target)) return _randomGen(prob, target);

  return (0, _Transformer2.default)(function (acc, next) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return Math.random() < prob ? _Transformer.step.apply(undefined, [target, acc, next].concat(args)) : acc;
  }, function (acc) {
    return (0, _Transformer.complete)(target, acc);
  }, function () {
    return (0, _Transformer.init)(target);
  });
}, 2, _library.placeholder);

/**
 * @private @function _randomGen
 * - private version of random returning a generator
 *
 * @see @function random
 *
 * @returns {Generator}
 * - a generator that will lazily yield values from iterable sequence with a
 *   probability of prob
 *
 * @throws TypeError
 * - target is not an iterable
 */

function _randomGen(prob, target) {
  var iterator, item, result;
  return regeneratorRuntime.wrap(function _randomGen$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if ((0, _checks.isIterable)(target)) {
            _context.next = 2;
            break;
          }

          throw new Error("Cannot get random elements from non-iterable " + target + "!");

        case 2:
          iterator = (0, _iterables.getIterator)(target);
          item = iterator.next();
          result = void 0;

        case 5:
          if (item.done) {
            _context.next = 16;
            break;
          }

          if (!(Math.random() < prob)) {
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
          _context.next = 5;
          break;

        case 16:
          return _context.abrupt("return");

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, _marked[0], this);
}