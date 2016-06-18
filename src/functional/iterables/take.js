import { isArray, isIterable, isFunction } from "./../../utils/checks";
import { currify } from "./../curry";
import getIterator from "./get-iterator";

/**
 * @public @function take
 * - gets the first 'number' of elements from an iterable specified
 *   by num
 * 
 * @param {Number} num
 * - the count of elements to take from iterable
 *
 * @param {Iterable} target
 * - the target iterable
 *
 * @returns {Iterable}
 * - an iterable with the first 'number' of elements or all elements
 *   if total number of elements < 'number'
 *
 * @throws Error
 * - target is not/does not implement the iterable interface
 *
 * @throws Error
 * - non-monoid without an empty method
 * 
 * @throws Error
 * - non-monoid without a concatMutable(concat) method
 */
export default currify((num, target) => {
  if (!isIterable(target))
    throw new Error(`Cannot take elements from non-iterable ${target}!`);

  else if (isArray(target)) {
    num = (num > target.length)? target.length: num;
    return target.slice(0, num);
  }

  // TODO: Eliminate the below checks after creating a Monoid class
  //       and checking for instanceof Monoid
  else if (!isFunction(target.empty))
    throw new Error(
      "take cannot be applied on a monoid without the empty method!"
    );

  else if (!isFunction(target.concatMutable))
    throw new Error(
      "take cannot be applied on a monoid without the concatMutable method!"
    );

  const iterator = getIterator(target);
  const result = target.empty();
  let i = 0;
  let item = iterator.next();
  while (i++ < num && !item.done) {
    result.concatMutable(item.value);
    item = iterator.next();
  }

  return result;
});

/**
 * @public @function takeWhile
 * - gets elements from the beginning of an iterable while the predicate
 *   holds true
 * 
 * @param {Function} predicate
 * - the predicate function returning a Boolean value that is applied
 *   against the elements within the iterable
 *
 * @param {Iterable} target
 * - the target iterable
 *
 * @returns {Iterable}
 * - an iterable with the first 'number' of elements or all elements
 *   if total number of elements < 'number'
 *
 * @throws Error
 * - target is not/does not implement the iterable interface
 *
 * @throws Error
 * - predicate is not a function
 *
 * @throws Error
 * - non-monoid without an empty method
 * 
 * @throws Error
 * - non-monoid without a concatMutable(concat) method
 */
export const takeWhile = currify((predicate, target) => {
  if (!isIterable(target))
    throw new Error(`Cannot takeWhile elements from non-iterable ${target}!`);

  else if (!isFunction(predicate))
    throw new Error(
      `Cannot takeWhile elements with non-function predicate ${predicate}!`
    );

  // TODO: Eliminate the below checks after creating a Monoid class
  //       and checking for instanceof Monoid
  else if (!isFunction(target.empty))
    throw new Error(
      "take cannot be applied on a monoid without the empty method!"
    );

  else if (!isFunction(target.concatMutable))
    throw new Error(
      "take cannot be applied on a monoid without the concatMutable method!"
    );

  const iterator = getIterator(target);
  const result = target.empty();
  let item = iterator.next();
  while (predicate(item.value) && !item.done) {
    result.concatMutable(item.value);
    item = iterator.next();
  }

  return result;
});
