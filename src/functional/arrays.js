import { isFunction, isArray } from "./../utils/checks";

import { compose } from "./composition";
import currify from "./currify";

const getResults = (name, arrayFunc, ...args) => {
  const last = args[args.length - 1];

  if (!isFunction(last)) {
    if (args.length <= 1)
      throw new Error(
        `${name} cannot be applied without first specifying a function!`
      );

    else if (!isArray(last))
      throw new Error(`${name} cannot be applied against non-array: ${last}!`);

    return arrayFunc.call(last, compose(...(args.slice(0, -1))));

  }

  /**
   * @return function - An array method with at least 1 pre-loaded functions
   *   If the returned function is called with an array as its first
   *   argument, the array method with all pre-loaded functions are called
   *
   *   If the returned function is called with a non-array as the first
   *   argument, function assumes and collects all arguments as a single
   *   array and executes the array method with all pre-loaded functions
   */
  return currify((...targets) => {
    if (targets.length < 1) {
      throw new Error(
        `Array function ${name} cannot be called with no arguments!`
      );
    }

    let array = (isArray(targets[0]))? targets[0]: targets;

    return arrayFunc.call(array, compose(...args));
  });
};

export const map = (...args) => getResults("Map", Array.prototype.map, ...args);

export const filter = (...args) =>
  getResults("Filter", Array.prototype.filter, ...args);

export const reduceLeft = (...args) =>
  getResults("ReduceLeft", Array.prototype.reduce, ...args);

export const reduceRight = (...args) =>
  getResults("ReduceRight", Array.prototype.reduceRight, ...args);

//TODO: every/all, 
