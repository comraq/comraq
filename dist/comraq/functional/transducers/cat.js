"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Transformer = require("./Transformer");

var _Transformer2 = _interopRequireDefault(_Transformer);

var _iterables = require("./../iterables");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @public @function cat
 * - the transducer version of concat by calling reduce on each next element
 *   of the iteration, assusming that each is a collection itself
 *
 * @param {Transformer} target
 * - takes a collection of collections and "flattens" it by 1 level
 *
 * @returns {Transfomer}
 * - a transformer that will "flatten" nested collection/iterations
 *
 * @see @mixin Transformer
 *
 * @throws TypeError
 * - if target is not a instance of Transformer mixin
 */
exports.default = function (target) {
  if (!(0, _Transformer.isTransformer)(target)) throw new TypeError("Non-transformer " + target + " is supplied to concat Transducer!");

  return (0, _Transformer2.default)(function (acc, next) {
    return (0, _iterables.reduce)(target, acc, next);
  }, function (acc) {
    return (0, _Transformer.complete)(target, acc);
  }, function () {
    return (0, _Transformer.init)(target);
  });
};

/**
 * @private @function _preserveReduced
 * - internal function to check and re-wrap target if it's is already
 *   Reduced
 *
 * @param {Any} target
 * - the target to check
 *
 * @return {Any}
 * - the target param but double wrapped if already Reduced
 */


var _preserveReduced = function _preserveReduced(target) {
  return (0, _Transformer.isReduced)(target) ? (0, _Transformer2.default)(target) : target;
};