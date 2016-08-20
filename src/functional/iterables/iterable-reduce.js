import { currify, placeholder } from "./../library";
import { isIterable, isFunction } from "./../../utils/checks";

import getIterator from "./get-iterator";

import { isTransformer, step, complete } from "./../transducers/Transformer";
import { isReduced, deref } from "./../transducers/Reduced";

/**
 * @private @function reduce
 * - reduces down the list of elements in the iterable given a reducing
 *   function and initial accumulator
 *
 * @param {Function} func
 * - the reducing function
 *
 * @param {Any} acc
 * - the initial accumulator
 *
 * @param {Iterable} iterable
 * - the iterable to iterate through
 *
 * @param {Number} index (optional)
 * - the index of the current element in the iterating sequence passed
 *   as an additional parameter to the reducing function (index starting from 0)
 *
 * @param {Iterator} iterator (optional)
 * - the starting iterator (if not starting the reducing function from the
 *   beginning of the iteratable sequence)
 *
 * @returns {Any}
 * - the reduced result stored in the accumulator - acc
 *
 * @throws Error
 * - if func is not a function
 *
 * @throws Error
 * - if iterable is not/does not implement the iterator interface
 */
const reduce =  currify((
  func,
  acc,
  iterable,
  index = 0,
  iterator = getIterator(iterable)
) => {
  if (!isIterable(iterable))
    throw new Error(
      `Cannot get iterator of non-iterable ${iterable}!`
    );

  else if (!isFunction(func))
    throw new Error(
      `iterableReduce expected a reducing function, got ${func}!`
    );

  else if (isTransformer(func))
    return reduceT(func, acc, iterable, index, iterator);

  let item = iterator.next();
  if (item.done)
    return acc;

  acc = func(acc, item.value, index, iterable);
  return reduce(func, acc, iterable, index + 1, iterator);
}, 3, false, placeholder);

export default reduce;

/**
 * @private @function reduceT
 * - same as reduce but modified for reducing transducers
 * - calls the transformer's complete function (1-arity) at the end of
 *   iteration
 * - also checks for early termination by calling deref on the accumulated
 *   result if result is of Reduced monad
 *
 * @see reduce
 * @link https://www.youtube.com/watch?v=6mTbuzafcII
 * @link https://www.youtube.com/watch?v=4KqUvG8HPYo
 */
const reduceT = (
  func,
  acc,
  iterable,
  index,
  iterator
) => {
  let item = iterator.next();

  if (item.done)
    return complete(func, acc);

  acc = step(func, acc, item.value, index, iterable);
  if (isReduced(acc))
    return deref(acc);

  return reduceT(func, acc, iterable, index + 1, iterator);
};
