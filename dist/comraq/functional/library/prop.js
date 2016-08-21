"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasProp = exports.withProp = exports.getProp = undefined;

var _checks = require("./../../utils/checks");

var _utils = require("./../../utils");

var _curry = require("./curry");

var _curry2 = _interopRequireDefault(_curry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var toString = _utils.types.toString;
var sNumber = _utils.types.sNumber;
var sString = _utils.types.sString;
var sMap = _utils.types.sMap;
var sSet = _utils.types.sSet;


/**
 * @public @function getProp
 * - Gets the property of a target object
 *
 * @param {Any} prop
 * - the property to search for
 *
 * @param {Any} target
 * - the target object/map
 *
 * @return {Function|Any|Null}
 * - a curried function with prop preset if target is not passed in
 * - value of property from target if found
 * - null otherwise
 *
 * @throws Error
 * - non-string or number passed as prop if target is object
 */
var getProp = exports.getProp = (0, _curry2.default)(function (prop, target) {
  if (!hasProp(prop, target)) return null;

  switch (toString(target)) {
    case sMap:
    case sSet:
      return target.get(prop);

    default:
      return target[prop];
  }
}, 2, _curry.placeholder);

/**
 * @public @function withProp
 * - Copies and returns a new object with the provided prop
 *
 * @param {String|Number} prop
 * - the property for the new prop value
 *
 * @param {Any} value (optional)
 * - the target value for the property
 *
 * @param {Any} target
 * - the target to copy with the new property: value
 *
 * @return {Function|Any}
 * - a curried function with prop and/or value preset
 *   if target is not passed in
 * - target with new property: value
 *
 * @throws Error
 * - non-string or number passed as prop
 */
var withProp = exports.withProp = (0, _curry2.default)(function (prop, value, target) {
  var mutate = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

  var sPropType = toString(prop);
  if (sPropType !== sString && sPropType !== sNumber) throw new Error("First argument '" + prop + "' of getProp must be string or number!");

  if ((0, _checks.isPrimitive)(target)) {
    (function () {
      var temp = target;
      target = {
        valueOf: function valueOf() {
          return temp;
        }
      };
    })();
  }

  var toMerge = {};
  toMerge[prop] = value;

  if (!mutate) return Object.assign({}, target, toMerge);

  return Object.assign(target, toMerge);
}, 3, _curry.placeholder);

/**
 * @public @function hasProp
 * - checks whether the target instance has a specified property
 *
 * @param {Any} prop
 * - the property to search for
 *
 * @param {Any} target
 * - the target object/map
 *
 * @param {Boolean} inherited (optional)
 * - flag to indicate whether to check for inherited properties, defaults to
 *   false
 *
 * @return {Boolean}
 * - true if target has prop, if inherited is true, then inherited
 *   properties are also checked, false otherwise
 */
var hasProp = exports.hasProp = (0, _curry2.default)(function (prop, target) {
  var inherited = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  if (inherited && prop in target) return true;

  switch (toString(target)) {
    case sMap:
    case sSet:
      return target.has(prop);

    default:
      return target.hasOwnProperty(prop);
  }
}, 2, _curry.placeholder);