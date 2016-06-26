"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureUnreduced = exports.ensureReduced = exports.isReduced = exports.deref = undefined;

var _checks = require("./../../utils/checks");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var reducedValue = Symbol.for("reduced-value");
var reducedFlag = Symbol.for("reduced-flag");

/**
 * @private @class _Reduced
 * - a box around a reduced value to short circuit transducers
 *
 * @param {Any} value
 * - the value to box
 */

var _Reduced = function _Reduced(value) {
  _classCallCheck(this, _Reduced);

  this[reducedValue] = value;
  this[reducedFlag] = true;
};

/**
 * @public @function Reduced
 * - the public factory for _Reduced
 *
 * @see _Reduced
 */


var Reduced = function Reduced(target) {
  return new _Reduced(target);
};

exports.default = Reduced;

/**
 * @public @function deref
 * - gets the boxed value of a _Reduced instance
 *
 * @param {_Reduced} target
 * - the _Reduced instance
 *
 * @returns {Any}
 * - the yielded boxed value
 */

var deref = exports.deref = function deref(target) {
  return target[reducedValue];
};

/**
 * @public @function isReduced
 * - checks whether a target is an instance of _Reduced
 *
 * @returns {Boolean}
 * - true if target is an instance of _Reduced or the target's
 *   reduced-flag is set, false otherwise
 */
var isReduced = exports.isReduced = function isReduced(target) {
  return (0, _checks.isInstance)(_Reduced, target) || target[reducedFlag];
};

/**
 * @public @function ensureReduced
 * - takes a _Reduced or non-_Reduced instance and ensures
 *   the return of an _Reduced instance wrapping the non-_Reduced value
 * 
 * @param {Any|_Reduced} target
 * - _Reduced or non-_Reduced value to box
 *
 * @returns {_Reduced}
 * - an _Reduced instance with the corrected boxed value
 */
var ensureReduced = exports.ensureReduced = function ensureReduced(target) {
  if (isReduced(target)) return target;

  return Reduced(target);
};

/**
 * @public @function ensureUnreduced
 * - takes a _Reduced or non-_Reduced instance and ensures
 *   the return of the unboxed value
 * 
 * @param {Any|_Reduced} target
 * - _Reduced or non-_Reduced value to deref/unbox
 *
 * @returns {Any}
 * - the unboxed value if target is of _Reduced, target otherwise
 */
var ensureUnreduced = exports.ensureUnreduced = function ensureUnreduced(target) {
  if (!isReduced(target)) return target;

  return deref(target);
};