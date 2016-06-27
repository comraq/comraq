"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._concatMutable = exports._concat = exports.empty = undefined;

var _utils = require("./../../utils");

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
  switch (_utils.types.toString(monoid)) {
    case _utils.types.tString:
      return "";

    case _utils.types.tObject:
      return {};

    default:
      // types.tArrays
      return [];
  }
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
  switch (_utils.types.toString(sg)) {
    case _utils.types.tString:
      return sg + value;

    case _utils.types.tObject:
      return Object.assign({}, sg, value);

    default:
      // types.tArrays
      return sg.concat(value);
  }
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
  switch (_utils.types.toString(sg)) {
    case _utils.types.tString:
      return sg + value;

    case _utils.types.tObject:
      return Object.assign(sg, value);

    default:
      // types.tArrays
      sg.push(value);
      return sg;
  }
}, 2, false, _curry.placeholder);