"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _checks = require("./../../utils/checks");

/**
 * @public @function getIterator
 * - gets the iterator of the iterable target
 *
 * @param {Iterable} target
 * - the iterable target
 *
 * @return {Iterator}
 * - the iterator of the iterable
 *
 * @throws TypeError
 * - if target is not/does not implement the iterator interface
 */

exports.default = function (target) {
  // TODO: support other types of data structures such as objects by
  //       creating custom iterators
  if (!(0, _checks.isIterable)(target)) throw new TypeError("Cannot get iterator of non-iterable " + target + "!");

  return target[Symbol.iterator]();
};