"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _checks = require("./../../utils/checks");

/**
 * @public @function last
 * - gets the last element of the iterable
 * 
 * @param {Iterable} target
 * - the target iterable
 *
 * @returns {Any|Null}
 * - the last element of the iterable or null if no elements remain
 *
 * @throws Error
 * - target is not/does not implement the iterable interface
 */

exports.default = function (target) {
  if (!(0, _checks.isIterable)(target)) throw new Error("Cannot get last element of non-iterable " + target + "!");else if ((0, _checks.isArray)(target)) return (0, _checks.isUndefined)(target[target.length - 1]) ? null : target[target.length - 1];

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = target[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return item;
};