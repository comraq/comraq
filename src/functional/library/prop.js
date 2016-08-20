import { isPrimitive } from "./../../utils/checks";

import { types } from "./../../utils";
const { toString, sNumber, sString, sMap, sSet } = types;

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
  if (!hasProp(prop, target))
    return null;

  switch (toString(target)) {
    case sMap:
    case sSet:
      return target.get(prop);

    default:
      return target[prop];
  }
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
export const withProp = currify((prop, value, target, mutate = false) => {
  let sPropType = toString(prop);
  if (sPropType !== sString && sPropType !== sNumber)
    throw new Error(
      `First argument '${prop}' of getProp must be string or number!`
    );

  if (isPrimitive(target)) {
    let temp = target;
    target = {
      valueOf: () => temp
    };
  }

  let toMerge = {};
  toMerge[prop] = value;

  if (!mutate)
    return Object.assign({}, target, toMerge);

  return Object.assign(target, toMerge);

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
 * @param {Boolean} inherited (optional)
 * - flag to indicate whether to check for inherited properties, defaults to
 *   false
 *
 * @return {Boolean}
 * - true if target has prop, if inherited is true, then inherited
 *   properties are also checked, false otherwise
 */
export const hasProp = currify((prop, target, inherited = false) => {
  if (inherited && (prop in target))
    return true;

  switch (toString(target)) {
    case sMap:
    case sSet:
      return target.has(prop);

    default:
      return target.hasOwnProperty(prop);
  }
}, 2, false, placeholder);
