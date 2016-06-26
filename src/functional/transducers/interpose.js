import { isIterable } from "./../../utils/checks";
import { currify, placeholder } from "./../curry";
import { empty } from "./../algebraic";
import { getIterator } from "./../iterables";

import { concatMutable } from "./concat";
import { isReduced } from "./Reduced";
import {
  step, complete, init,
  default as Transformer,
  isTransformer
} from "./Transformer";

/**
 * @public @function interpose
 * - takes any entry and an iterable collection, returning a new iterable with
 *   the entry inserted between every element in the original collection
 *
 * @param {Any} entry
 * - any entry/element
 *
 * @param {Transformer|Iterable} target
 * - the transformer or target iterable
 *
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a new iterable with entry inserted between each element from the
 *   original collection
 */
export default currify((entry, target) => {
  if (!isTransformer(target))
    return _interpose(entry, target);

  let started = false;
  return Transformer(
    (acc, next, ...args) => {
      if (!started) {
        started = true;
        return step(target, acc, next, ...args);
      }

      let result = step(target, acc, entry, ...args);
      if (isReduced(result))
        return result;

      return step(target, result, next, ...args);
    },

    acc => complete(target, acc),

    () => init(target)
  );
}, 2, false, placeholder);

/**
 * @private @function _interpose
 * - private version of interpose that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 *
 * @see @function interpose
 *
 * @throws TypeError
 * - target is not an iterable
 */
const _interpose = (entry, target) => {
  if (!isIterable(target))
    throw new Error(`Cannot interpose elements for non-iterable ${target}!`);

  let result = empty(target);

  const iterator = getIterator(target);
  let item = iterator.next();

  if (!item.done) {
    result = concatMutable(item.value, result);
    for (item = iterator.next(); !item.done; item = iterator.next())
      result = concatMutable(item.value, concatMutable(entry, result));
  }

  return result;
};
