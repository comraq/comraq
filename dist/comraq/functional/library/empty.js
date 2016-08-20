"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.empty = undefined;

var _utils = require("./../../utils");

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
    case _utils.types.sString:
      return "";

    case _utils.types.sObject:
      return {};

    default:
      // Defaults to 'types.sArrays'
      return [];
  }
};