"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _checks = require("./../../utils/checks");

var _curry = require("./../curry");

var _prop = require("./../prop");

var _algebraic = require("./../algebraic");

var _iterables = require("./../iterables");

var _concat = require("./concat");

var _Transformer = require("./Transformer");

var _Transformer2 = _interopRequireDefault(_Transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a new iterable with elements matching keys in map replaced by
 *   the corresponding values
 *
 * @throws TypeError
 * - map is not of type Object or Map
 */
exports.default = (0, _curry.currify)(function (map, target) {
  if (!(0, _checks.isMap)(map) && !(0, _checks.isObject)(map)) throw new TypeError("replace cannot be applied without providing a replacement map or object!");

  if (!(0, _Transformer.isTransformer)(target)) return _replace(map, target);

  return (0, _Transformer2.default)(function (acc, next) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return _Transformer.step.apply(undefined, [target, acc, (0, _prop.hasProp)(next, map) ? (0, _prop.getProp)(next, map) : next].concat(args));
  }, function (acc) {
    return (0, _Transformer.complete)(target, acc);
  }, function () {
    return (0, _Transformer.init)(target);
  });
}, 2, false, _curry.placeholder);

/**
 * @private @function _replace
 * - private version of replace that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 * - uses the iterables's reduce to iterate and replace elements in iterable
 *   if found
 *
 * @see @function replace
 * @see @function iterables/reduce
 */

var _replace = function _replace(map, target) {
  return (0, _iterables.reduce)(function (acc, next) {
    return (0, _concat.concatMutable)((0, _prop.hasProp)(next, map) ? (0, _prop.getProp)(next, map) : next, acc);
  }, (0, _algebraic.empty)(target), target);
};