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
 * @param {Boolean} right (optional)
 * - the direction of curried arguments
 * - if right === true:
 *     - args will be curried from right to left for func
 * - otherwise:
 *     - args will be curried from left to right for func
 *
 * @param {Any} placeholder (optional)
 * - optional dummy value that can be used as placeholders when partially
 *   applying parameters in the middle of the function declaration
 * - if omitted, all future arguments will be accepted as legitimate/valid
 *   arguments to be passed to the curried function
 * - @example:
 *     const pl = "some placeholder value";
 *     let init = currify((...args) => args, 5, false, pl);
 *     let func;
 *
 *     func = init(pl, pl, pl, pl, "e"); // func( ___, ___, ___, ___, "e")
 *
 *     func = func(pl, "b", pl);         // func( ___, "b", ___, ___, "e")
 *
 *     func = func("a");                 // func( "a", "b", ___, ___, "e")
 *
 *     const result = func("c", "d");    // func( "a", "b", "c", "d", "e")
 *       |
 *       +-> function finally gets called, result = [ "a", "b", "c", "d", "e" ]
 *
 *
 *     NOTE: func("c", "d", "f") ------> // func( "a", "b", "c", "d", "e", "f")
 *       |
 *       +-> function gets called with all excess arguments
 *
 *     NOTE: const many = func(pl, pl, pl, pl, pl, pl, "g") 
 *       |
 *       +-> // many === func( ___, ___, ___, ___, ___, "g")
 *       |
 *       +-> many("a", "b", "c", pl, "e")
 *           |
 *           +-> // func( "a", "b", "c", ___, "e", "g")
 *           |
 *           +-> not yet evaluated, still a function!
 *
 * @return {Function}
 * - a curried function that will currify all arguments for func
 *   if not enough parameters are passed in
 *
 * @throws Error
 * - non-function passed as first argument
 */
export const currify = function currify(
  func, 
  fnLen = -1,
  right = false,
  placeholder = undefined
) {
  if (!isFunction(func))
    throw new Error(`Argument "${func}" of currify is not a function!`);

  if (fnLen <= 0)
    fnLen = func.length;
  
  if (arguments.length < 4)
    return _currify(func, fnLen, right);

  return _currifyPlaceholder(
    func,
    fnLen,
    right,
    placeholder,
    Array(fnLen).fill(placeholder)
  );
};

/**
 * @private @function _currify
 * - currify's internal helper recursive method
 *
 * @see @public @function currify
 */
const _currify = (func, fnLen, right, ...args) => {
  if (fnLen <= args.length)
    return func(...((right)? args.reverse(): args));

  return (...newArgs) =>
    _currify(func, fnLen, right, ...args, ...newArgs);
};

const _currifyPlaceholder = (func, fnLen, right, placeholder, args) => {
  const pos = args.indexOf(placeholder);
  if (pos === -1 || pos >= fnLen)
    return func(...((right)? args.reverse(): args));

  return (...newArgs) =>
    _currifyPlaceholder(
      func,
      fnLen,
      right,
      placeholder,
      _replacePlaceholders(placeholder, newArgs, args.slice())
    );
};

const _replacePlaceholders = (match, newArray, baseArray) => {
  let pos = -1;

  newArray.forEach(e => {
    pos = baseArray.indexOf(match, ++pos);

    pos = (pos === -1)? baseArray.length: pos;

    if (e !== match)
      baseArray[pos] = e;
  });

  return baseArray;
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
