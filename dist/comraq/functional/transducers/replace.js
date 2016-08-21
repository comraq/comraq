"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _checks = require("./../../utils/checks");

var _types = require("./../../utils/types");

var _library = require("./../library");

var _iterables = require("./../iterables");

var _Transformer = require("./Transformer");

var _Transformer2 = _interopRequireDefault(_Transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [_replaceGen].map(regeneratorRuntime.mark);

/**
 * @public @function replace
 * - replace elements from an iterable collection which matches the key of
 *   an object or map object with the corresponding value
 *
 * @param {Object|Map} map
 * - the object/map providing the replacement key value pairs
 *
 * @param {Transformer|Iterable|Functor|Monoid} target
 * - the transformer or target iterable/functor
 *
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a generator yielding elements matching keys in map replaced by
 *   the corresponding values
 *
 * @throws TypeError
 * - map is not of type Object or Map
 */
exports.default = (0, _library.curry)(function (map, target) {
  var type = (0, _types.toString)(map);
  if (type !== _types.sMap && type !== _types.sObject) throw new TypeError("replace cannot be applied without providing a replacement map or object!");

  if (!(0, _Transformer.isTransformer)(target)) return _replaceGen(map, target);

  return (0, _Transformer2.default)(function (acc, next) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return _Transformer.step.apply(undefined, [target, acc, (0, _library.hasProp)(next, map) ? (0, _library.getProp)(next, map) : next].concat(args));
  }, function (acc) {
    return (0, _Transformer.complete)(target, acc);
  }, function () {
    return (0, _Transformer.init)(target);
  });
}, 2, _library.placeholder);

/**
 * @private @function _replaceGen
 * - private version of replace returning a generator
 *
 * @see @function replace
 *
 * @returns {Generator}
 * - a generator that will lazily yield all elements in the sequence while
 *   replacing those found in map with the values from map if element is
 *   found as a key
 *
 * @throws TypeError
 * - target is not an iterable
 */

function _replaceGen(map, target) {
  var result, iterator, item;
  return regeneratorRuntime.wrap(function _replaceGen$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if ((0, _checks.isIterable)(target)) {
            _context.next = 2;
            break;
          }

          throw new Error("Cannot keep elements of non-iterable " + target + "!");

        case 2:
          result = void 0;
          iterator = (0, _iterables.getIterator)(target);
          item = iterator.next();

        case 5:
          if (item.done) {
            _context.next = 18;
            break;
          }

          if (!(0, _library.hasProp)(item.value, map)) {
            _context.next = 12;
            break;
          }

          _context.next = 9;
          return (0, _library.getProp)(item.value, map);

        case 9:
          result = _context.sent;
          _context.next = 15;
          break;

        case 12:
          _context.next = 14;
          return item.value;

        case 14:
          result = _context.sent;

        case 15:

          item = iterator.next(result);
          _context.next = 5;
          break;

        case 18:
          return _context.abrupt("return");

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, _marked[0], this);
}