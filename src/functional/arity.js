import { isFunction } from "./../utils/checks";
import { currify, placeholder } from "./curry";


/**
 * @public @function nAry
 * - given a natural number and a function, returns the function with a
 *   arity that will be fixed to the provided number
 *
 * @param {Number} n
 * - the number to fix the arity to
 *
 * @param {Function} func
 * - the function to fix the arity for
 *
 * @return {Function}
 * - a new function which will only take n number of arguments and call
 *   func, returning its value
 *
 * @throws TypeError
 * - if n is not a natural number (less than 0)
 *
 * @throws TypeError
 * - if func is not a function
 */
export default currify((n, func) => {
  if (n < 0)
    throw new TypeError(
      `nAry cannot fix the arity given a non natural number: ${n}!`
    );

  if (!isFunction(func))
    throw new TypeError(
      `nAry cannot fix the arity of non-function ${func}!`
    );

  if (n === 0)
    return () => func();

  return currify(
    (...args) => func(...(args.slice(0, n))),
    n, false, placeholder
  );
}, 2, false, placeholder);
