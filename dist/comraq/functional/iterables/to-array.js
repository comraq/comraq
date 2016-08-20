"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reverse = undefined;

var _checks = require("./../../utils/checks");

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

/**
 * @public @function reverse
 * - takes an iterable target and returns a new iterable that will iterate
 *   though the same elements but in reverse order
 *
 * @param {Iterable} target
 * - the iterable target to reverse
 *
 * @returns {Iterable|Array}
 * - a new iterable (implemented as an array) which iterates
 *   in the reverse order of input iterable
 *
 * @throws Error
 * - if target is not/does not implement the iterator interface
 */
var reverse = exports.reverse = function reverse(target) {
  if (!(0, _checks.isIterable)(target)) throw new Error("Cannot get iterator of non-iterable " + target + "!");else if ((0, _checks.isArray)(target)) return target.slice().reverse();

  var result = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = target[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;

      result.unshift(item);
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

  return result;
};

/**
 * @public @function toArray
 * - takes an iterable target and returns all values in the iterable
 *   sequence as an array
 *
 * @param {Iterable} target
 * - the source iterable target
 *
 * @returns {Iterable|Array}
 * - a new iterable (implemented as an array) with all the entries from the
 *   original target
 */

exports.default = function (_ref) {
  var _ref2 = _toArray(_ref);

  var target = _ref2;
  return target;
};