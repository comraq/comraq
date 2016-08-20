import { isArray } from "./../../utils/checks";
import { pFunction } from "./../../utils/types";

/**
 * @private @function getResult
 * - reduces the list of function arguments passed into pipe or compose
 *
 * @param {Function} reducerIterator
 * - the iterator function to iterate through the reducers
 *
 * @param {Boolean} spread
 * - boolean flag to indicate whether to spread results of previous
 *   function as multiple params into the next function
 * - this flag helps differentiate between whether the next function expects
 *   and array or expects mutliple arguments (in which case the result
 *   should be spread and passed in as multiple parameters)
 *
 * @param {Function, variadic} ...args
 * - the array of functions to compose/pipe
 *
 * @returns {Any}
 * - the accumulated result of calling all the composed/piped functions
 *
 * @throws Error
 * - if any non-functions are passed into the middle of the composition
 *   pipeline
 */
const getResult = (reducerIterator, spread, ...args) => {
  return reducerIterator.call(args, (result, func) => {
    if (typeof func !== pFunction)
      throw new Error("Composition functions cannot take non-function "
        + "as intermediate arguments!");

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

/**
 * @public @function compose
 * - composes any number of functions and executes them from right to left
 *   order, piping each result to next function
 *
 * @param {Function|Any} ...args
 * - any number of functions to compose, last argument can be non-function
 * - if a non-function last argument is provided, the result of the function
 *   pipeline will be executed immediately with the last argument as the
 *   ONLY function argument
 *
 * @returns {Function|Any}
 * - returns a piped function which will execute all functions when
 *   arguments are passed
 * - returns the result of executing the function pipeline if last arguments
 *   to ...args is non-function
 *
 * @throws Error
 * - if non-function arguments are passed before any functions in the
 *   pipeline
 */
export const compose = (...args) => {
  const target = args[args.length - 1];

  if (typeof target !== pFunction) {
    if (args.length <= 1)
      throw new Error("Functions must be supplied before function arguments!");

    return getResult(Array.prototype.reduceRight, false, ...args);
  }

  /**
   * Variadic due to needing to capture all trailing arguments
   * as params passed to user function
   *
   * Call user func by bundling all potential params in array
   */
  return (...targets) => {
    let spread = true;
    if (targets.length <= 1) {
      spread = false;
      targets = targets[0];
    }

    return getResult(Array.prototype.reduceRight, spread, ...args, targets);
  };
};

/**
 * @public @function pipe
 * - pipe any number of functions and executes them from left to right
 *   order, piping each result to next function
 *
 * @see @function compose
 * - this function is completely the same as compose except for
 *   executing the functions with the reverse order
 */
export const pipe = (...args) => {
  const target = args[0];

  if (typeof target !== pFunction) {
    if (args.length <= 1)
      return target;

    else
      return getResult(Array.prototype.reduce, false, ...args);
  }

  return (...targets) => {
    let spread = true;
    if (targets.length <= 1) {
      spread = false;
      targets = targets[0];
    }

    return getResult(Array.prototype.reduce, spread, targets, ...args);
  };
};
