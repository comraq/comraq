import { isIterable } from "./../../utils/checks";
import { curry, placeholder } from "./../library";
import { getIterator } from "./../iterables";

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
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a generator yielding avlues with entry inserted between each
 *   element from the original collection
 */
export default curry((entry, target) => {
  if (!isTransformer(target))
    return _interposeGen(entry, target);

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
}, 2, placeholder);

/**
 * @private @function _interposeGen
 * - private version of interpose returning a generator
 *
 * @see @function interpose
 *
 * @returns {Generator}
 * - a generator that will lazily yield all values in the sequence that
 *   while also yielding entry in between each consecutive element from
 *   original sequence
 *
 * @throws TypeError
 * - target is not an iterable
 */
function* _interposeGen (entry, target) {
  if (!isIterable(target))
    throw new Error(`Cannot interpose elements for non-iterable ${target}!`);

  let result;

  const iterator = getIterator(target);
  let item = iterator.next();

  if (!item.done) {
    result = yield item.value;
    item = iterator.next(result);

    while (!item.done) {
      yield entry;
      result = yield item.value;

      item = iterator.next(result);
    }
  }

  return;
}
