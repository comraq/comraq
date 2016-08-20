import { pFunction } from "./../../utils/types";

/**
 * @private @function applyFunctions
 * - reduces the list of function arguments passed into pipe or compose
 *   after accepting arguments
 *
 * @param {Function} fold
 * - the fold function (can be foldl/reduce or foldr/reduceRight)
 *
 * @param {Array<Function>} funcs
 * - an array of functions to eventually fold over
 *
 * @returns {Function :: variadic -> Any}
 * - a function accepting any number of arguments,
 * - first calling the the first function in funcs with args, then
 *   repeated piping the results of the function from the previous to the next
 *
 * @throws TypeError
 * - if any non-functions are passed into the middle of the composition
 *   pipeline
 */
const applyFuncs = (fold, funcs) => (...args) => {
  let first = true;
  return fold.call(funcs, (args, func) => {
    if (typeof func !== pFunction)
      throw new TypeError("Composition cannot take non-function "
        + "as intermediate arguments!");

    if (first) {
      first = false;
      return func(...args);
    }
    return func(args);
  }, args);
};

/**
 * @public @function compose
 * - composes any number of functions and executes them from right to left
 *   order, piping each result to next function
 *
 * @param {Function|Any} ...args
 * - any number of functions to compose
 *
 * @returns {Function|Any}
 * - returns a piped function which will execute all functions when
 *   further arguments are passed
 *
 * @throws Error
 * - if non-function arguments are passed before any functions in the
 *   pipeline
 */
export const compose = (...args) =>
  applyFuncs(Array.prototype.reduceRight, args);

/**
 * @public @function pipe
 * - pipe any number of functions and executes them from left to right
 *   order, piping each result to next function
 *
 * @see @function compose
 * - this function is completely the same as compose except for
 *   executing the functions with the reverse order
 */
export const pipe = (...args) =>
  applyFuncs(Array.prototype.reduce, args);
