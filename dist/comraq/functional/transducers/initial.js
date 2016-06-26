"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _checks = require("./../../utils/checks");

var _iterables = require("./../iterables");

var _strings = require("./../strings");

var _algebraic = require("./../algebraic");

var _arrays = require("./../arrays");

var _concat = require("./concat");

var _Transformer = require("./Transformer");

var _Transformer2 = _interopRequireDefault(_Transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @public @function initial
 * - gets all except the last element of the iterable
 * 
 * @param {Transformer|Iterable} target
 * - the transformer or target iterable
 *
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - an iterable with all but the last element of the iterable
 * - empty iterable if empty target iterable is empty
 */

exports.default = function (target) {
  if (!(0, _Transformer.isTransformer)(target)) return _initial(target);

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
 * @private @function _inital
 * - private version of initial that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 *
 * @see @function initial
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */


var _initial = function _initial(target) {
  if (!(0, _checks.isIterable)(target)) throw new Error("Cannot get init elements of non-iterable " + target + "!");else if ((0, _checks.isArray)(target)) return (0, _strings.length)(target) > 1 ? (0, _arrays.slice)(0, -1, target) : (0, _algebraic.empty)(target);

  var iterator = (0, _iterables.getIterator)(target);
  var acc = (0, _algebraic.empty)(target);

  var curr = iterator.next();
  var next = iterator.next();
  while (!next.done) {
    (0, _concat.concatMutable)(curr.value, acc);
    curr = next;
    next = iterator.next();
  }

  return acc;
};