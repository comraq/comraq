import { pFunction, pNumber } from "./../../utils/types";

/**
 * @public @var {Symbol} placeholder
 * - a placeholder symbol for filling in gaps when currying with curry
 *
 * @see @public @function curry
 */
export const placeholder = Symbol.for("comraq/curry/placeholder");

/**
 * @public @var {Symbol} aritySymbol
 * - a symbol keeping track of the arity of a curried function
 *
 * @see @public @function curry
 */
const aritySymbol = Symbol.for("comraq/curry/curryArity");

/**
 * @public @function isCurried
 * - checks whether a function is a curried function
 *
 * @param {Function} f
 * - the function to check
 *
 * @return {Boolean}
 * - true if the function is curried
 *   (ie: marked as curried by the 'curry' function)
 * - false otherwise
 *
 * @see @public @function curry
 */
export const isCurried = f => typeof f[aritySymbol] === pNumber;

/**
 * @public @function getArity
 * - gets the curried arity of a function
 *
 * @param {Function} f
 * - the function to get the arity for
 *
 * @return {Number}
 * - (-1) if the function is not marked as curried by 'curry'
 * - the natural number arity of the curried function otherwise
 *
 * @see @public @function curry
 */
export const getArity = f => {
  const result = f[aritySymbol];
  if (typeof result === pNumber)
    return result;

  return -1;
};


/**
 * @public @function curriedApply
 * - applies arguments to a function
 * - if the function is marked as 'curried', it will only apply the number of
 *   arguments equal to the curried arity of the function
 * - otherwise, calls the non-curried function with all arguments
 * - as long as arguments remain and func returns another function,
 *   the function will be continuously applied with the curried number of
 *   arguments (all args if non-curried) until either:
 *   - arguments run out
 *   - returned result is not a function
 *
 * @param {Function} func
 * - the function to apply
 *
 * @param {Any, variadic} args
 * - any number of arguments to call the function with
 *
 * @returns {Any}
 * - if all arguments are consumed by func, the return value of func is returned
 * - otherwise, repeatedly apply func and its result func with arguments
 *   equal to the curried arity of the result func
 *
 * @throws TypeError
 * - if func is not a function
 */
export const curriedApply = (func, ...args) => {
  if (typeof func !== pFunction)
    throw new TypeError("First argument of curriedApply must be a function!");

  let arity = func[aritySymbol];
  if (typeof arity !== pNumber)
    return func(...args);

  else if (args.length <= arity)
    return func(...args);

  let result = func;
  while (typeof result === pFunction && args.length !== 0) {
    arity = (typeof result[aritySymbol] === pNumber)?
      result[aritySymbol] : args.length;

    result = result(...(args.splice(0, arity)));
  }
  return result;
};

/**
 * @private @function _markCurried
 * - marks a function as curried by setting the 'aritySymbol'
 *   property to have the curried function arity value
 *
 * @param {Number} n
 * - the curried function arity to set
 *
 * @param {Function} f
 * - the function to mark as 'curried'
 *
 * @return {Function}
 * - the marked function f, with an 'aritySymbol' property
 *   containing the curried arity number
 *
 * @see @private @var {Symbol} aritySymbol
 */
const _markCurried = (n, f) => (f[aritySymbol] = n, f);

/**
 * @public @function partial
 * - partially applies a function with any number of arguments
 *
 * @param {Function} func
 * - the function to partially apply
 *
 * @param {Any, variadic} ...args
 * - any number of arguments
 *
 * @returns {Function}
 * - the partially function
 *
 * @throws TypeError
 * - non-function passed as first argument
 */
export const partial = (func, ...args) => {
  if (typeof func !== pFunction)
    throw new TypeError(
      `First argument '${func}' of partial is not a function!`
    );

  return func.bind(this, ...args);
};

/**
 * @public @function curry
 * - auto curries a function
 * - curried function are marked with 'aritySymbol', indicating the arity of
 *   the returned 'curried' function
 *
 * @param {Function} func
 * - the function to be auto-curried
 *
 * @param {Number} fnLen (optional)
 * - the expected number of arguments of func, as variadic functions or
 *   those with default parameters will not have a useful length property,
 *   pass in fnLen to specify a custom function.length if preferred
 *
 * @param {Any} placeholder (optional)
 * - optional dummy value that can be used as placeholders when partially
 *   applying parameters in the middle of the function declaration
 * - if omitted, all future arguments will be accepted as legitimate/valid
 *   arguments to be passed to the curried function
 * - @example:
 *     const pl = "some placeholder value";
 *     let init = curry((...args) => args, 5, false, pl);
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
 *     NOTE: const sparse = func(pl, pl, pl, pl, pl, pl, "g")
 *       |
 *       +-> // many === func( ___, ___, ___, ___, ___, ___, "g")
 *       |
 *       +-> sparse("a", "b", "c", pl, "e")
 *           |
 *           +-> // func( "a", "b", "c", ___, "e", ___, "g")
 *           |
 *           +-> not yet evaluated, still a function!
 *
 * @return {Function}
 * - a curried function that will curry all arguments for func
 *   if not enough parameters are passed in
 *
 * @throws Error
 * - non-function passed as first argument
 */
export default function curry(
  func,
  fnLen = -1,
  placeholder = undefined
) {
  if (typeof func !== pFunction)
    throw new Error(`Argument "${func}" of curry is not a function!`);

  if (fnLen <= 0)
    fnLen = func.length;

  if (fnLen === 0)
    return _markCurried(0, (...args) => func(...args));

  if (arguments.length < 3)
    return _curry(func, fnLen);

  return _curryPlaceholder(
    func,
    fnLen,
    placeholder,
    Array(fnLen).fill(placeholder)
  );
}

/**
 * @private @function _curry
 * - curry's internal helper recursive method
 *
 * @see @public @function curry
 */
const _curry = (func, fnLen, ...args) => {
  if (fnLen <= 0)
    return func(...args);

  return _markCurried(fnLen, (...newArgs) => {
    if (newArgs.length === 0)
      throw new Error(
        "Curried funtions must be called with at least 1 argument!"
      );

    return _curry(func, fnLen - newArgs.length, ...args, ...newArgs);
  });
};

/**
 * @private @function _curryPlaceholder
 * - curry's internal helper method if placeholder is used
 *
 * @see @public @function curry
 * @see @public @function curry @param {Any} placeholder
 */
const _curryPlaceholder = (func, fnLen, placeholder, args) => {
  const arityRemain =
    fnLen - _countExcludeMatchInRange(placeholder, args, 0, fnLen);

  if (arityRemain <= 0)
    return func(...args);

  return _markCurried(arityRemain, (...newArgs) =>
    _curryPlaceholder(
      func,
      fnLen,
      placeholder,
      _replacePlaceholders(placeholder, newArgs, args.slice())
    ));
};

/**
 * @private @function _replacePlaceholders
 * - _curryPlaceholder's helper method to replace any placeholders from
 *   the currently collected arguments with new arguments
 *
 * @see @private @function _curryPlaceholder
 *
 * @param {Any} match
 * - the target placeholder/dummy value to match
 *
 * @param {Array} newArray
 * - the array of new arguments
 *
 * @param {Array} baseArray
 * - the array of currently existing arguments
 *
 * @return {Array}
 * - the baseArray with placeholders replaced from valid elements in the
 *   newArray
 */
const _replacePlaceholders = (match, newArray, baseArray) => {
  let pos = -1;

  for (let e of newArray) {
    pos = baseArray.indexOf(match, ++pos);

    pos = (pos === -1)? baseArray.length: pos;

    if (e !== match)
      baseArray[pos] = e;

    else if (pos === baseArray.length)
      baseArray[pos] = match;

  }
  return baseArray;
};

/**
 * @private @function _countExcludeMatchInRange
 * - counts the number of strictly equal elements in array of a given range
 *   that does not match a target
 * - helper function used by _curryPlaceholder
 *
 * @see @private @function _curryPlaceholder
 *
 * @param {Any} match
 * - the match to exclude from the resulting count
 *
 * @param {Array} array
 * - the source array to count from
 *
 * @param {Number} start (optional)
 * - the start index of the array
 *
 * @param {Number} end (optional)
 * - the end index of the array
 *
 * @return {Number}
 * - the number of occurences of elements in array that does not equal match
 */
const _countExcludeMatchInRange = (
  match,
  array,
  start = 0,
  end = array.length
) => {
  let result = 0;
  let e;

  end = (end > array.length)? array.length: end;

  while (start < end) {
    e = array[start++];
    result += (e !== match)? 1: 0;
  }

  return result;
};
