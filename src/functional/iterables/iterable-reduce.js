import { currify } from "./../curry";
import { isIterable, isFunction } from "./../../utils/checks";

import getIterator from "./get-iterator";

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
  if (!isFunction(func))
    throw new Error(
      `iterables - reduce expected a reducing function, got ${func}!`
    );

  else if (!isIterable(iterable))
    throw new Error(
      `Cannot get iterator of non-iterable ${iterable}!`
    );

  let item = iterator.next();
  if (item.done)
    return acc;

  acc = func(acc, item.value, index, iterable);
  return reduce(func, acc, iterable, index + 1, iterator);
});

export default reduce;
