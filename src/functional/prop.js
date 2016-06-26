import {
  isString,
  isNumber,
  isUndefined,
  isNull,
  isMap
} from "./../utils/checks";

import { currify, placeholder } from "./curry";

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
export const getProp = currify((prop, target) => {
  if (isMap(target)) {
    if (!target.has(prop))
      return null;

    return target.get(prop);
  }

  if (!isString(prop) && !isNumber(prop))
    throw new Error(
      `First argument '${prop}' of getProp must be string or number!`
    );

  if (!hasProp(prop, target))
    return null;

  return target[prop];
}, 2, false, placeholder);

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
export const withProp = currify((prop, value = null, target) => {
  if (!isString(prop) && !isNumber(prop))
    throw new Error(
      `First argument '${prop}' of getProp must be string or number!`
    );

  let temp = {};
  if (!isUndefined(target) && !isNull(target)) {
    target = (isString(target))? {}: target;

    temp[prop] = value;
  }

  return Object.assign({}, target, temp);
}, 3, false, placeholder);

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
export const hasProp = currify((prop, target) => {
  if (isMap(target))
    return target.has(prop);

  return target.hasOwnProperty(prop);
}, 2, false, placeholder);
