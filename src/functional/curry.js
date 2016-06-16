import { isFunction } from "../utils/checks";

/**
 * @public @function curry
 * - curries a function with any number of arguments
 *
 * @param {Function} func
 * - the function to curry
 *
 * @param {Any, variadic} ...args
 * - any number of arguments
 *
 * @returns {Function}
 * - the curried function
 *
 * @throws Error
 * - non-function passed as first argument
 */
const curry = (func, ...args) => {
  if (!isFunction(func))
    throw new Error(`First argument '${func}' of curry is not a function!`);

  return func.bind(this, ...args);
};

export default curry;

/**
 * @public @function currify
 * - auto curries a function
 *
 * @param {Function} func
 *   - the function to be auto-curried
 *
 * @param {Number} fnLen (optional)
 *   - the expected number of arguments of func, as variadic functions or
 *     those with default parameters will not have a useful length property,
 *     pass in fnLen to specify a custom function.length if preferred
 *
 * @return {Function}
 *   - a curried function that will auto-curry func if not enough parameters
 *     are passed in
 *
 * @throws Error
 * - non-function passed as first argument
 */
export const currify = (func, fnLen = 0) => {
  if (!isFunction(func))
    throw new Error(`Argument '${func}' of currify is not a function!`);

  if (fnLen <= 0)
    fnLen = func.length;

  if (fnLen === 0)
    return func();
  
  return (...args) => currify(func.bind(this, ...args), fnLen - args.length);
};
