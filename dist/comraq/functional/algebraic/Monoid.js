"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._concatMutable = exports._concat = exports.empty = undefined;

var _checks = require("./../../utils/checks");

var _curry = require("./../curry");

/**
 * @public @function empty
 * - gets the empty/void/unit value of a monoid
 *
 * @param {Any|Monoid} monoid
 * - the monoid instance to retrieve unit from
 *
 * @returns {Any|Monoid}
 * - the empty/unit value
 *
 * @throws TypeError
 * - if monoid is not a valid monoid instance,
 *   (does not have the empty method)
 */
var empty = exports.empty = function empty(monoid) {
  if (!(0, _checks.isFunction)(monoid.empty)) throw new TypeError("Cannot get empty/unit value of " + monoid + " without the empty method!");

  return monoid.empty();
};

/**
 * @private @function _concat
 * - concatenates a value into a semi-group
 * - for public usage, see transducers/concat
 *
 * @see @function transducers/concat
 *
 * @param {Any|Semigroup} value
 * - the target concatenated to sg
 *
 * @param {Any|Semigroup} sg
 * - the target being concatenated to
 *
 * @returns {Any|Semigroup}
 * - the concatenated target
 *
 * @throws TypeError
 * - if sg is not a valid semigroup,
 *   (does not have the concat method)
 */
var _concat = exports._concat = (0, _curry.currify)(function (value, sg) {
  if (!(0, _checks.isFunction)(sg.concat)) throw new TypeError("Semigroup " + sg + " does not have concat method!");

  return sg.concat(value);
}, 2, false, _curry.placeholder);

/**
 * @private @function _concatMutable
 * - mutable version of concat
 * - for public usage, see transducers/concatMutable
 *
 * @see @function concat
 * @see @function transducers/concatMutable
 *
 * @throws TypeError
 * - if sg is not a valid semigroup,
 *   (does not have the concatMutable method)
 */
var _concatMutable = exports._concatMutable = (0, _curry.currify)(function (value, sg) {
  if (!(0, _checks.isFunction)(sg.concatMutable)) throw new TypeError("Semigroup " + sg + " does not have concatMutable method!");

  return sg.concatMutable(value);
}, 2, false, _curry.placeholder);