import { isIterable } from "./../../utils/checks";
import { pFunction } from "./../../utils/types";
import { curry, placeholder } from "./../library";
import { getIterator } from "./../iterables";

import {
  step, complete, init,
  default as Transformer,
  isTransformer
} from "./Transformer";

/**
 * @public @function map
 * - map a function against a functor, a Monoid
 *   or all elements of an iterable collection
 * - in addition, this also passes the index, original iterable and the number
 *   of times the predicate function to keep was called as the second and
 *   third, and fourth argument
 *
 * @param {Function} func
 * - the mapping function applied against each element in the iterable
 *
 * @param {Transformer|Iterable|Functor|Monoid} target
 * - the transformer or target iterable/functor
 *
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a lazy generator which will yield all elements
 *   applied with the mapping functon
 *
 * @throws TypeError
 * - mapping function func is not a function
 */
export default curry((func, target) => {
  if (typeof func !== pFunction)
    throw new TypeError(
      "map cannot be applied without first specifying a function!"
    );

  if (!isTransformer(target))
    return _mapGen(func, target);

  let i = 0;
  return Transformer(
    (acc, next, ...args) =>
      step(target, acc, func(next, ...args, i++), ...args),

    acc => complete(target, acc),

    () => init(target)
  );
}, 2, placeholder);

/**
 * @private @function _mapGen
 * - private verson of map returning a generator
 *
 * @see @function @map
 *
 * @returns {Generator}
 * - a generator that will lazily yield all values in the sequence after
 *   applying the mapping function
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */
export function* _mapGen(func, target, i = 0) {
  if (!isIterable(target))
    throw new Error(`Cannot map over non-iterable ${target}!`);

  const iterator = getIterator(target);
  let item = iterator.next();
  for (let index = 0; !item.done; ++index) {
    let result = yield func(item.value, index, target, i++);
    item = iterator.next(result);
  }

  return;
}
