import { isArray, isIterable } from "./../../utils/checks";
import { pUndefined } from "./../../utils/types";

/**
 * @public @function last
 * - gets the last element of the iterable
 *
 * @param {Iterable} target
 * - the target iterable
 *
 * @returns {Any|Null}
 * - the last element of the iterable or null if no elements remain
 *
 * @throws Error
 * - target is not/does not implement the iterable interface
 */
export default target => {
  if (!isIterable(target))
    throw new Error(`Cannot get last element of non-iterable ${target}!`);

  else if (isArray(target))
    return (typeof target[target.length - 1] === pUndefined)?
      null: target[target.length - 1];

  for (var item of target);
  return item;
};
