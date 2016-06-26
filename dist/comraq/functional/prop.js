"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasProp = exports.withProp = exports.getProp = undefined;

var _checks = require("./../utils/checks");

var _curry = require("./curry");

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
var getProp = exports.getProp = (0, _curry.currify)(function (prop, target) {
  if ((0, _checks.isMap)(target)) {
    if (!target.has(prop)) return null;

    return target.get(prop);
  }

  if (!(0, _checks.isString)(prop) && !(0, _checks.isNumber)(prop)) throw new Error("First argument '" + prop + "' of getProp must be string or number!");

  if (!hasProp(prop, target)) return null;

  return target[prop];
}, 2, false, _curry.placeholder);

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
var withProp = exports.withProp = (0, _curry.currify)(function (prop) {
  var value = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
  var target = arguments[2];

  if (!(0, _checks.isString)(prop) && !(0, _checks.isNumber)(prop)) throw new Error("First argument '" + prop + "' of getProp must be string or number!");

  var temp = {};
  if (!(0, _checks.isUndefined)(target) && !(0, _checks.isNull)(target)) {
    target = (0, _checks.isString)(target) ? {} : target;

    temp[prop] = value;
  }

  return Object.assign({}, target, temp);
}, 3, false, _curry.placeholder);

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
 * @return {Boolean}
 * - true if target has prop directly (not inherited), false otherwise
 */
var hasProp = exports.hasProp = (0, _curry.currify)(function (prop, target) {
  if ((0, _checks.isMap)(target)) return target.has(prop);

  return target.hasOwnProperty(prop);
}, 2, false, _curry.placeholder);