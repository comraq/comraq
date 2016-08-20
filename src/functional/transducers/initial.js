import { isIterable, isUndefined } from "./../../utils/checks";
import { getIterator } from "./../iterables";
import { length } from "./../strings";

import {
  step, complete, init,
  default as Transformer,
  isTransformer
} from "./Transformer";

/**
 * @public @function initial
 * - gets all except the last element of the iterable
 *
 * @param {Transformer|Iterable} target
 * - the transformer or target iterable
 *
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - a generator yielding all but the last element of the iterable sequence
 * - empty generator if target iterable is empty
 */
export default target => {
  if (!isTransformer(target))
    return _initialGen(target);

  let stored = undefined;
  return Transformer(
    (acc, next, ...args) => {
      if (isUndefined(stored)) {
        stored = [ next, ...args ];
        return acc;
      }

      let prev = stored.splice(0, length(stored), next, ...args) ;
      return step(target, acc, ...prev);
    },

    acc => complete(target, acc),

    () => init(target)
  );
};

/**
 * @private @function _initialGen
 * - private version of tail returning a generator
 *
 * @see @function initial
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */
function* _initialGen(target) {
  if (!isIterable(target))
    throw new Error(`Cannot get init elements of non-iterable ${target}!`);

  const iterator = getIterator(target);
  let curr = iterator.next();
  let next = iterator.next();

  while (!next.done) {
    // TODO: Must peek ahead to not yield last element in sequence
    //       However, as a result, the return value of yield is sent
    //       to the one element after original corresponding generation
    let result = yield curr.value;
    curr = next;
    next = iterator.next(result);
  }

  return;
}
