"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _checks = require("./../../utils/checks");

var _iterables = require("./../iterables");

var _strings = require("./../strings");

var _Transformer = require("./Transformer");

var _Transformer2 = _interopRequireDefault(_Transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [_initialGen].map(regeneratorRuntime.mark);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @public @function initial
 * - gets all except the last element of the iterable
 * 
 * @param {Transformer|Iterable} target
 * - the transformer or target iterable
 *
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - a generator yielding all but the last element of the iterable sequence
 * - empty generator if target iterable is empty
 */

exports.default = function (target) {
  if (!(0, _Transformer.isTransformer)(target)) return _initialGen(target);

  var stored = undefined;
  return (0, _Transformer2.default)(function (acc, next) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    var _stored;

    if ((0, _checks.isUndefined)(stored)) {
      stored = [next].concat(args);
      return acc;
    }

    var prev = (_stored = stored).splice.apply(_stored, [0, (0, _strings.length)(stored), next].concat(args));
    return _Transformer.step.apply(undefined, [target, acc].concat(_toConsumableArray(prev)));
  }, function (acc) {
    return (0, _Transformer.complete)(target, acc);
  }, function () {
    return (0, _Transformer.init)(target);
  });
};

/**
 * @private @function _initialGen
 * - private version of tail returning a generator
 *
 * @see @function initial
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */


function _initialGen(target) {
  var iterator, curr, next, result;
  return regeneratorRuntime.wrap(function _initialGen$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if ((0, _checks.isIterable)(target)) {
            _context.next = 2;
            break;
          }

          throw new Error("Cannot get init elements of non-iterable " + target + "!");

        case 2:
          iterator = (0, _iterables.getIterator)(target);
          curr = iterator.next();
          next = iterator.next();

        case 5:
          if (next.done) {
            _context.next = 13;
            break;
          }

          _context.next = 8;
          return curr.value;

        case 8:
          result = _context.sent;

          curr = next;
          next = iterator.next(result);
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