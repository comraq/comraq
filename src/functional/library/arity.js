import { pFunction } from "./../../utils/types";
import { default as curry, placeholder, isCurried } from "./curry";

/**
 * @public @function nAry
 * - given a natural number and a function, returns the function with a
 *   arity that will be fixed/maxed at the provided number
 * - the returned function will preserve the original function's 'curried'
 *   status
 * - the fixed arity function will not preserve placeholders
 *   of the original curried function
 *
 * @param {Number} n
 * - the number to cap the arity to
 *
 * @param {Function} func
 * - the function to fix the arity for
 *
 * @return {Function}
 * - a new function which will only take n number of arguments and call
 *   func, returning its value
 *
 * @throws RangeError
 * - if n is not a natural number (less than 0)
 *
 * @throws TypeError
 * - if func is not a function
 */
export default curry((n, func) => {
  if (n < 0)
    throw new RangeError(
      `nAry cannot fix the arity given a non natural number: ${n}!`
    );

  if (typeof func !== pFunction)
    throw new TypeError(
      `nAry cannot fix the arity of non-function ${func}!`
    );

  if (!isCurried(func))
    return (...args) => func(...(args.slice(0, n)));

  return curry(
    (...args) => func(...(args.slice(0, n))),
    n
  );
}, 2, placeholder);
