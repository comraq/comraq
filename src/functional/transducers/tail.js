import { isArray, isIterable } from "./../../utils/checks";
import { getIterator } from "./../iterables";
import iterReduce from "./../iterables/iterable-reduce";
import { length } from "./../strings";
import { empty } from "./../algebraic";
import { slice } from "./../arrays";

import { concatMutable } from "./concat";
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
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - an iterable with all but the first element of the iterable
 * - empty iterable if empty target iterable is empty
 */
export default target => {
  if (!isTransformer(target))
    return _tail(target);

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
 * @private @function _tail
 * - private version of tail that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 *
 * @see @function tail
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */
const _tail = target => {
  if (!isIterable(target))
    throw new Error(`Cannot get tail elements of non-iterable ${target}!`);

  else if (isArray(target))
    return (length(target) > 1)?
      slice(1, length(target), target): empty(target);

  const iterator = getIterator(target);
  iterator.next();
  return iterReduce(
    (acc, next) => concatMutable(next, acc),
    empty(empty),
    target,
    iterator
  );
};
