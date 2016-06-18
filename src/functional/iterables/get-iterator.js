import { isIterable } from "./../../utils/checks";

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
export default target => {
  if (!isIterable(target))
    throw new Error(
      `Cannot get iterator of non-iterable ${target}!`
    );

  return target[Symbol.iterator]();
};
