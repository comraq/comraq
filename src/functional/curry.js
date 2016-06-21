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
 * - the function to be auto-curried
 *
 * @param {Number} fnLen (optional)
 * - the expected number of arguments of func, as variadic functions or
 *   those with default parameters will not have a useful length property,
 *   pass in fnLen to specify a custom function.length if preferred
 *
 * @return {Function}
 * - a curried function that will currify all arguments for func
 *   if not enough parameters are passed in
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

/**
 * @public @function autoCurry
 * - same as currify for functions that returns non-functions as return value
 * - if func's execution returns another function autoCurry is re-applied
 *
 * @see @public @function currify
 * @see @private @function _autoCurry
 *
 * @example
 *   const addFiveVals = autoCurry(a => b => c => d => e => a + b + c + d + e);
 *
 *   addFiveVals.should.be.a("function");
 *   addFiveVals(1)(2).should.be.a("function");
 *   addFiveVals(1, 2).should.be.a("function");
 *   addFiveVals(1, 2, 3, 4, 5).should.equal(15);
 *   addFiveVals(1)(2)(3)(4)(5).should.equal(15);
 *   addFiveVals(1, 2)(3, 4)(5).should.equal(15);
 */
export const autoCurry = (func, fnLen = 0) => {
  if (!isFunction(func))
    throw new Error(`Argument '${func}' of currify is not a function!`);

  if (fnLen <= 0)
    fnLen = func.length;

  return _autoCurry(func, fnLen);
};

/**
 * @private @function _autoCurry
 * - recursive helper function for autoCurry
 *
 * @param {Function} func
 * - the function to be curried
 *
 * @param {Number} fnLen
 * - the remaining number of arguments (function arity) for func
 *
 * @param {Any, variadic} ...args
 * - the arbitrary number of arguments to be bound to func
 *
 * @returns {Any|Function}
 * - the result if func returns non-function
 * - result of autoCurry wrapping the returned function
 *
 * @see @public @function autoCurry
 */
const _autoCurry = (func, fnLen, ...args) => {
  let argsToBind = args.splice(0, fnLen);

  // Got less arguments than necessary for current function execution,
  // build up accumulated arguments with bind
  if (fnLen > argsToBind.length)
    return (...newArgs) =>  _autoCurry(
      func.bind(this, ...argsToBind),
      fnLen - argsToBind.length,
      ...newArgs
    );

  // Got enough arguments, execute function and check if
  // result is another function, if so, recurse, otherwise return result
  let result = func(...argsToBind);
  if (!isFunction(result))
    return result;

  return _autoCurry.call(this, result, result.length, ...args);
};
