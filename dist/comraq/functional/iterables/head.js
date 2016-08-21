"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _checks = require("./../../utils/checks");

var _getIterator = require("./get-iterator");

var _getIterator2 = _interopRequireDefault(_getIterator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @public @function head
 * - gets the first element of the iterable
 *
 * @param {Iterable} target
 * - the target iterable
 *
 * @returns {Any|Null}
 * - the first element of the iterable or null if no elements remain
 *
 * @throws Error
 * - target is not/does not implement the iterable interface
 */
exports.default = function (target) {
  if (!(0, _checks.isIterable)(target)) throw new Error("Cannot get head element of non-iterable " + target + "!");else if ((0, _checks.isArray)(target)) return _typeof(target[0]) === _checks.pUndefined ? null : target[0];

  return (0, _getIterator2.default)(target).next().value;
};