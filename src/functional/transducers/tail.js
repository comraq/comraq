import { isIterable } from "./../../utils/checks";
import { getIterator } from "./../iterables";

import {
  step, complete, init,
  default as Transformer,
  isTransformer
} from "./Transformer";

/**
 * @public @function tail
 * - gets all except the first element of the iterable
 * 
 * @param {Transformer|Iterable} target
 * - the transformer or target iterable
 *
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - a generator with all but the first element of the iterable sequence
 * - empty generator if target iterable is empty
 */
export default target => {
  if (!isTransformer(target))
    return (function* (target) { yield* _tailGen(target); })(target);

  let first = true;
  return Transformer(
    (acc, next, ...args) => {
      if (first) {
        first = false;
        return acc;
      }

      return step(target, acc, next, ...args);
    },

    acc => complete(target, acc),

    () => init(target)
  );
};

/**
 * @private @function _tailGen
 * - private version of tail returning a generator
 *
 * @see @function tail
 *
 * @returns {Generator}
 * - a generator that will lazily yield all values in the sequence after
 *   skiping the first (head) element
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */
function* _tailGen(target) {
  if (!isIterable(target))
    throw new Error(`Cannot get tail elements of non-iterable ${target}!`);

  const iterator = getIterator(target);
  iterator.next();

  let item = iterator.next();
  while (!item.done) {
    let result = yield item.value;
    item = iterator.next(result);
  }

  return;
}
