import { isString, isNumber, isUndefined, isNull } from "./../utils/checks";

import { currify } from "./curry";

/**
 * @public @function getProp
 * - Gets the property of a target object
 *
 * @param {String|Number} prop
 *   - the property used to access the object
 *
 * @param {Any} target
 *   - the target object
 *
 * @return {Function|Any|Null}
 *   - a curried function with prop preset if target is not passed in
 *   - value of property from target if found
 *   - null otherwise
 *
 * @throws Error
 * - non-string or number passed as prop
 */
export const getProp = currify((prop, target) => {
  if (!isString(prop) && !isNumber(prop))
    throw new Error(
      `First argument '${prop}' of getProp must be string or number!`
    );

  if (isUndefined(target) || isNull(target) || (isUndefined(target[prop])))
    return null;

  return target[prop];
});

/**
 * @public @function withProp
 * - Copies and returns a new object with the provided prop
 *
 * @param {String|Number} prop
 *   - the property for the new prop value
 *
 * @param {Any} value (optional)
 *   - the target value for the property
 *
 * @param {Any} target
 *   - the target to copy with the new property: value
 *
 * @return {Function|Any}
 *   - a curried function with prop and/or value preset if target is not passed in
 *   - target with new property: value
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
}, 3);
