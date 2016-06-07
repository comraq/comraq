import { isFunction } from "../utils/checks";

export const curry = (func, ...args) => {
  if (!isFunction(func))
    throw new Error(`First argument '${func}' of curry is not a function!`);

  return func.bind(null, ...args);
};

/**
 * @function - Auto curries a function
 * @param {function} func
 *   - the function to be auto-curried
 * @param {number|optional} fnLen
 *   - the expected number of arguments of func, as variadic functions or
 *     those with default parameters will not have a useful length property,
 *     pass in fnLen to specify a custom function.length if preferred
 * @return {function}
 *   - a curried function that will auto-curry func if not enough parameters
 *     are passed in
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
