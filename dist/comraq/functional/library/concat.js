"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.concatMutable = undefined;

var _utils = require("./../../utils");

var _curry = require("./curry");

var _curry2 = _interopRequireDefault(_curry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @public @function concat
 * - concatenates a value into a semi-group
 *
 * @param {Any|Semigroup} sg
 * - the target being concatenated to
 *
 * @param {Any|Semigroup} value
 * - the target concatenated to sg
 *
 * @returns {Any|Semigroup}
 * - the concatenated target
 *
 * @throws TypeError
 * - if sg is not a valid semigroup,
 *   (does not have the concat method)
 *
 * @throws TypeError
 * - if sg and value are not of the same semigroup
 */
exports.default = (0, _curry2.default)(function (sg, value) {
  var vType = _utils.types.toString(value);

  switch (_utils.types.toString(sg)) {
    case _utils.types.sString:
      if (vType !== _utils.types.sString) throw new TypeError("Cannot concat a non-string to string!");

      return sg + value;

    case _utils.types.sObject:
      if (vType !== _utils.types.sObject) throw new TypeError("Cannot concat a non-object to object!");

      return Object.assign({}, sg, value);

    case _utils.types.sArray:
      if (vType !== _utils.types.sArray) throw new TypeError("Cannot concat a non-array to array!");

      return sg.concat(value);

    default:
      throw new TypeError("Do not know how to concat for unknown type: " + sg + "!");
  }
}, 2, _curry.placeholder);

/**
 * @private @function concatMutable
 * - mutable version of concat
 *
 * @see @function concat
 */

var concatMutable = exports.concatMutable = (0, _curry2.default)(function (sg, value) {
  var vType = _utils.types.toString(value);

  switch (_utils.types.toString(sg)) {
    case _utils.types.sString:
      if (vType !== _utils.types.sString) throw new TypeError("Cannot concatMutable a non-string to string!");

      return sg + value;

    case _utils.types.sObject:
      if (vType !== _utils.types.sObject) throw new TypeError("Cannot concatMutable a non-object to object!");

      return Object.assign(sg, value);

    case _utils.types.sArray:
      if (vType !== _utils.types.sArray) throw new TypeError("Cannot concatMutable a non-array to array!");

      sg.push.apply(sg, _toConsumableArray(value));
      return sg;

    default:
      throw new TypeError("Do not know how to concatMutable for unknown type: " + sg + "!");
  }
}, 2, _curry.placeholder);