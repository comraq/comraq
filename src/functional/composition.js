import { isFunction, isArray } from "./../utils/checks";

import composable from "./composable";

const getResult = (reducer, spread, ...args) => {
  return reducer.call(args, (result, func) => {
    if (!isFunction(func))
      throw new Error("Composition functions cannot take non-function "
        + "intermediate arguments!");

    /**
     * All user function params captured/bundled in array
     * Spread/Rest to pass them all into user function
     */
    if (isArray(result) && spread)
      return func(...result);

    else
      return func(result);
 
  });
};

export const compose = (...args) => {
  const target = args[args.length - 1];

  if (!isFunction(target)) {
    if (args.length <= 1)
      throw new Error("Functions must be supplied before targets!");

    return getResult(Array.prototype.reduceRight, false, ...args);
  }

  /**
   * Variadic due to needing to capture all trailing arguments
   * as params passed to user function
   *
   * Call user func by bundling all potential params in array
   */
  return composable((...targets) => {
    let spread = true;
    if (targets.length <= 1) {
      spread = false;
      targets = targets[0];
    }

    return getResult(Array.prototype.reduceRight, spread, ...args, targets);
  });

};

export const pipe = (...args) => {
  const target = args[0];

  if (!isFunction(target)) {
    if (args.length <= 1)
      return target;

    else
      return getResult(Array.prototype.reduce, false, ...args);
  }

  return composable((...targets) => {
    let spread = true;
    if (targets.length <= 1) {
      spread = false;
      targets = targets[0];
    }

    return getResult(Array.prototype.reduce, spread, targets, ...args);
  });
};
