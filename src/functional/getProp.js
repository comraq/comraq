import { isString, isNumber, isUndefined, isNull } from "./../utils/checks";

import curry from "./curry";
import composable from "./composable";

/**
 * @function - Gets the property of a target object
 * @param {string|number} prop
 *   - the property used to access the object
 * @param {any|optional} target
 *   - the target object
 * @return {function|any|null}
 *   - a curried function with prop preset if target is not passed in
 *   - value of property from target if found
 *   - null otherwise
 */
const getProp = (prop, target) => {
  if (!isString(prop) && !isNumber(prop))
    throw new Error(
      `First argument '${prop}' of getProp must be string or number!`
    );

  if (!isUndefined(target) && !isNull(target))
    return (isUndefined(target[prop]))? null: target[prop];

  return composable(curry(getProp, prop));
};

export default getProp;
