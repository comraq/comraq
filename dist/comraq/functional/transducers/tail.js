"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _checks = require("./../../utils/checks");

var _iterables = require("./../iterables");

var _iterableReduce = require("./../iterables/iterable-reduce");

var _iterableReduce2 = _interopRequireDefault(_iterableReduce);

var _strings = require("./../strings");

var _algebraic = require("./../algebraic");

var _arrays = require("./../arrays");

var _concat = require("./concat");

var _Transformer = require("./Transformer");

var _Transformer2 = _interopRequireDefault(_Transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @public @function tail
 * - gets all except the first element of the iterable
 * 
 * @param {Transformer|Iterable} target
 * - the transformer or target iterable
 *
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - an iterable with all but the first element of the iterable
 * - empty iterable if empty target iterable is empty
 */

exports.default = function (target) {
  if (!(0, _Transformer.isTransformer)(target)) return _tail(target);

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
 * @private @function _tail
 * - private version of tail that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 *
 * @see @function tail
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */


var _tail = function _tail(target) {
  if (!(0, _checks.isIterable)(target)) throw new Error("Cannot get tail elements of non-iterable " + target + "!");else if ((0, _checks.isArray)(target)) return (0, _strings.length)(target) > 1 ? (0, _arrays.slice)(1, (0, _strings.length)(target), target) : (0, _algebraic.empty)(target);

  var iterator = (0, _iterables.getIterator)(target);
  iterator.next();
  return (0, _iterableReduce2.default)(function (acc, next) {
    return (0, _concat.concatMutable)(next, acc);
  }, (0, _algebraic.empty)(_algebraic.empty), target, iterator);
};