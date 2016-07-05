import { isNumber, isIterable } from "./../../utils/checks";
import { currify, placeholder } from "./../curry";
import { getIterator } from "./../iterables";

import {
  step, complete, init,
  default as Transformer,
  isTransformer
} from "./Transformer";

/**
 * @public @function random
 * - takes a floating point probability number between 0.0 - 1.0 and an
 *   iterable collection, then returns a subset of the collection with the
 *   given probability
 *
 * @param {Number} prob
 * - the floating point probability
 *
 * @param {Transformer|Iterable} target
 * - the transformer or target iterable
 *
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a new iterable with elements each with probability of prob to
 *   to exist
 *
 * @throws TypeError
 * - prob is not a valid number between 0.0 - 1.0 (inclusive)
 */
export default currify((prob, target) => {
  if (!isNumber(prob) || prob < 0 || prob > 1)
    throw new TypeError(
      `random cannot be applied with invalid probability ${prob}!`
    );

  if (!isTransformer(target))
    return (function* (prob, target) {
      yield* _randomGen(prob, target);
    })(prob, target);
    //return _random(prob, target);

  return Transformer(
    (acc, next, ...args) =>
      (Math.random() < prob)? step(target, acc, next, ...args): acc,

    acc => complete(target, acc),

    () => init(target)
  );
}, 2, false, placeholder);

/**
 * @private @function _randomGen
 * - private version of random returning a generator
 *
 * @see @function random
 *
 * @returns {Generator}
 * - a generator that will lazily yield values from iterable sequence with a
 *   probability of prob
 *
 * @throws TypeError
 * - target is not an iterable
 */
function* _randomGen(prob, target) {
  if (!isIterable(target))
    throw new Error(`Cannot get random elements from non-iterable ${target}!`);

  const iterator = getIterator(target);
  let item = iterator.next();

  let result;
  while (!item.done) {
    if (Math.random() < prob)
      result = yield item.value;

    else
      result = undefined;

    item = iterator.next(result);
  }

  return;
}
