import { isObject, isFunction } from "../utils/checks";

import curry from "./curry";
import currify from "./currify";

// TODO: getProp, withProp
export const prop = (property, target) => {
  if (!property)
    throw new Error(`First argument '${property}' of getProp is invalid!`);

  else if (!target)
    return curry(prop);

  else if (isFunction(target))
    return "temp";

  else if (isObject(target))
    return target[property];
};

export const withProp = () => {};

// Slice to clone array before reverse for immutability
export const reverse = currify(array => array.slice().reverse()); 
