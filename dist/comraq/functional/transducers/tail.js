"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _checks = require("./../../utils/checks");

var _iterables = require("./../iterables");

var _Transformer = require("./Transformer");

var _Transformer2 = _interopRequireDefault(_Transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [_tailGen].map(regeneratorRuntime.mark);

/**
 * @public @function tail
 * - gets all except the first element of the iterable
 *
 * @param {Transformer|Iterable} target
 * - the transformer or target iterable
 *
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - a generator with all but the first element of the iterable sequence
 * - empty generator if target iterable is empty
 */
exports.default = function (target) {
  if (!(0, _Transformer.isTransformer)(target)) return _tailGen(target);

  var first = true;
  return (0, _Transformer2.default)(function (acc, next) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    if (first) {
      first = false;
      return acc;
    }

    return _Transformer.step.apply(undefined, [target, acc, next].concat(args));
  }, function (acc) {
    return (0, _Transformer.complete)(target, acc);
  }, function () {
    return (0, _Transformer.init)(target);
  });
};

/**
 * @private @function _tailGen
 * - private version of tail returning a generator
 *
 * @see @function tail
 *
 * @returns {Generator}
 * - a generator that will lazily yield all values in the sequence after
 *   skiping the first (head) element
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */


function _tailGen(target) {
  var iterator, item, result;
  return regeneratorRuntime.wrap(function _tailGen$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if ((0, _checks.isIterable)(target)) {
            _context.next = 2;
            break;
          }

          throw new Error("Cannot get tail elements of non-iterable " + target + "!");

        case 2:
          iterator = (0, _iterables.getIterator)(target);

          iterator.next();

          item = iterator.next();

        case 5:
          if (item.done) {
            _context.next = 12;
            break;
          }

          _context.next = 8;
          return item.value;

        case 8:
          result = _context.sent;

          item = iterator.next(result);
          _context.next = 5;
          break;

        case 12:
          return _context.abrupt("return");

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, _marked[0], this);
}