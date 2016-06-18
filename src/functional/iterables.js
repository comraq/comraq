import { currify } from "./curry";
import { isIterable, isFunction, isArray } from "./../utils/checks";

/**
 * @public @function getIterator
 * - gets the iterator of the iterable target
 *
 * @param {Iterable} target
 * - the iterable target
 *
 * @return {Iterator}
 * - the iterator of the iterable
 *
 * @throws Error
 * - if target is not/does not implement the iterator interface
 */
export const getIterator = target => {
  if (!isIterable(target))
    throw new Error(
      `Cannot get iterator of non-iterable ${target}!`
    );

  return target[Symbol.iterator]();
};

/**
 * @public @function reverse
 * - takes an iterable target and returns a new iterable that will iterate
 *   though the same elements but in reverse order
 * 
 * @param {Iterable} target
 * - the iterable target to reverse
 *
 * @returns {Iterable}
 * - a new iterable which iterates in the reverse order of input iterable
 *
 * @throws Error
 * - if target is not/does not implement the iterator interface
 */
export const reverse = target => {
  if (!isIterable(target))
    throw new Error(
      `Cannot get iterator of non-iterable ${target}!`
    );

  else if (isArray(target))
    return target.slice().reverse();

  let result = [];
  for (const item of target)
    result.unshift(item);

  return result;
};


/**
 * @public @function reduce
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
export const reduce = currify((
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
