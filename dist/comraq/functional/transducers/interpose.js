"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _checks = require("./../../utils/checks");

var _library = require("./../library");

var _iterables = require("./../iterables");

var _Reduced = require("./Reduced");

var _Transformer = require("./Transformer");

var _Transformer2 = _interopRequireDefault(_Transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [_interposeGen].map(regeneratorRuntime.mark);

/**
 * @public @function interpose
 * - takes any entry and an iterable collection, returning a new iterable with
 *   the entry inserted between every element in the original collection
 *
 * @param {Any} entry
 * - any entry/element
 *
 * @param {Transformer|Iterable} target
 * - the transformer or target iterable
 *
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a generator yielding avlues with entry inserted between each
 *   element from the original collection
 */
exports.default = (0, _library.currify)(function (entry, target) {
  if (!(0, _Transformer.isTransformer)(target)) return _interposeGen(entry, target);

  var started = false;
  return (0, _Transformer2.default)(function (acc, next) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    if (!started) {
      started = true;
      return _Transformer.step.apply(undefined, [target, acc, next].concat(args));
    }

    var result = _Transformer.step.apply(undefined, [target, acc, entry].concat(args));
    if ((0, _Reduced.isReduced)(result)) return result;

    return _Transformer.step.apply(undefined, [target, result, next].concat(args));
  }, function (acc) {
    return (0, _Transformer.complete)(target, acc);
  }, function () {
    return (0, _Transformer.init)(target);
  });
}, 2, false, _library.placeholder);

/**
 * @private @function _interposeGen
 * - private version of interpose returning a generator
 *
 * @see @function interpose
 *
 * @returns {Generator}
 * - a generator that will lazily yield all values in the sequence that
 *   while also yielding entry in between each consecutive element from
 *   original sequence
 *
 * @throws TypeError
 * - target is not an iterable
 */

function _interposeGen(entry, target) {
  var result, iterator, item;
  return regeneratorRuntime.wrap(function _interposeGen$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if ((0, _checks.isIterable)(target)) {
            _context.next = 2;
            break;
          }

          throw new Error("Cannot interpose elements for non-iterable " + target + "!");

        case 2:
          result = void 0;
          iterator = (0, _iterables.getIterator)(target);
          item = iterator.next();

          if (item.done) {
            _context.next = 19;
            break;
          }

          _context.next = 8;
          return item.value;

        case 8:
          result = _context.sent;

          item = iterator.next(result);

        case 10:
          if (item.done) {
            _context.next = 19;
            break;
          }

          _context.next = 13;
          return entry;

        case 13:
          _context.next = 15;
          return item.value;

        case 15:
          result = _context.sent;


          item = iterator.next(result);
          _context.next = 10;
          break;

        case 19:
          return _context.abrupt("return");

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, _marked[0], this);
}