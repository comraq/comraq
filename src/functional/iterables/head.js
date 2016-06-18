import { isArray, isUndefined, isIterable } from "./../../utils/checks";
import getIterator from "./get-iterator";

/**
 * @public @function head
 * - gets the first element of the iterable
 * 
 * @param {Iterable} target
 * - the target iterable
 *
 * @returns {Any|Null}
 * - the first element of the iterable or null if no elements remain
 *
 * @throws Error
 * - target is not/does not implement the iterable interface
 */
export default target => {
  if (!isIterable(target))
    throw new Error(`Cannot get head element of non-iterable ${target}!`);

  else if (isArray(target))
    return (isUndefined(target[0]))? null: target[0];

  return getIterator(target).next().value;
};
