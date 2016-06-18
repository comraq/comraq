import { isFunction, isArray, isIterable } from "./../../utils/checks";
import { getIterator } from "./../iterables";

/**
 * @public @function init
 * - gets all except the last element of the iterable
 * 
 * @param {Iterable} target
 * - the target iterable
 *
 * @returns {Iterable}
 * - an iterable with all but the last element of the iterable
 * - empty iterable if empty
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
export default target => {
  if (!isIterable(target))
    throw new Error(`Cannot get init elements of non-iterable ${target}!`);

  else if (isArray(target))
    return (target.length > 1)? target.slice(0, -1): [];

  // TODO: Eliminate the below checks after creating a Monoid class
  //       and checking for instanceof Monoid
  else if (!isFunction(target.empty))
    throw new Error(
      "init cannot be applied on a monoid without the empty method!"
    );

  else if (!isFunction(target.concatMutable))
    throw new Error(
      "init cannot be applied on a monoid without the concatMutable method!"
    );

  const iterator = getIterator(target);
  const acc = target.empty();

  let curr = iterator.next();
  let next = iterator.next();
  while (!next.done) {
    acc.concatMutable(curr.value);
    curr = next;
    next = iterator.next();
  }

  return acc;
};
