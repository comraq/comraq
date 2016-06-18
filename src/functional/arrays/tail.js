import { isArray, isIterable, isFunction } from "./../../utils/checks";
import { getIterator, reduce as iterReduce } from "./../iterables";

/**
 * @public @function tail
 * - gets all except the first element of the iterable
 * 
 * @param {Iterable} target
 * - the target iterable
 *
 * @returns {Iterable}
 * - an iterable with all but the first element of the iterable
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
    throw new Error(`Cannot get tail elements of non-iterable ${target}!`);

  else if (isArray(target))
    return (target.length > 1)? target.slice(1): [];

  // TODO: Eliminate the below checks after creating a Monoid class
  //       and checking for instanceof Monoid
  else if (!isFunction(target.empty))
    throw new Error(
      "tail cannot be applied on a monoid without the empty method!"
    );

  else if (!isFunction(target.concatMutable))
    throw new Error(
      "tail cannot be applied on a monoid without the concatMutable method!"
    );

  const iterator = getIterator(target);
  iterator.next();
  return iterReduce(
    (acc, next) => acc.concatMutable(next),
    target.empty(),
    target,
    iterator
  );
};
