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
 * @throws TypeError
 * - if target is not/does not implement the iterator interface
 */
export default target => {
  // TODO: support other types of data structures such as objects by
  //       creating custom iterators
  if (!isIterable(target))
    throw new TypeError(
      `Cannot get iterator of non-iterable ${target}!`
    );

  return target[Symbol.iterator]();
};
