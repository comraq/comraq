import { pFunction } from "./../../utils/types";
import {
  default as curry,
  curriedApply,
  getArity
} from "./curry";

/**
 * @public @function flip
 * - takes a function and flip the order of the first two arguments
 * - the returned function preserve's the original function's 'curried'
 *   status
 * - the flipped function will not preserve placeholders
 *   of the original curried function
 * - if the original function is curried with arity less than 2,
 *   the returned flipped function will be curried with arity 2
 *
 * @param {Function} f
 * - the function to flip the first two arguments for
 *
 * @returns {Function}
 * - a new function that will call the original function with the first
 *   two arguments' order flipped
 * - flip :: (a -> b -> c) -> b -> a -> c
 *
 * @throws TypeError
 * - if f is not a function
 */
export default curry(f => {
  if (typeof f !== pFunction)
    throw new TypeError(
      `Cannot call flip on Non-Function ${f}!`
    );

  let cArity = getArity(f);
  if (cArity === -1)
    return (a, b, ...args) => f(b, a, ...args);

  else if (cArity < 2)
    cArity = 2;

  return curry((a, b, ...args) => curriedApply(f, b, a, ...args), cArity);
});
