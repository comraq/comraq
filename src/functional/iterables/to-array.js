import { isIterable, isArray } from "./../../utils/checks";

/**
 * @public @function reverse
 * - takes an iterable target and returns a new iterable that will iterate
 *   though the same elements but in reverse order
 *
 * @param {Iterable} target
 * - the iterable target to reverse
 *
 * @returns {Iterable|Array}
 * - a new iterable (implemented as an array) which iterates
 *   in the reverse order of input iterable
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
 * @public @function toArray
 * - takes an iterable target and returns all values in the iterable
 *   sequence as an array
 *
 * @param {Iterable} target
 * - the source iterable target
 *
 * @returns {Iterable|Array}
 * - a new iterable (implemented as an array) with all the entries from the
 *   original target
 */
export default ([ ...target ]) => target;
