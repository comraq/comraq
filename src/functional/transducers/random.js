import { isNumber, isIterable } from "./../../utils/checks";
import { currify, placeholder } from "./../curry";
import { empty } from "./../algebraic";
import { getIterator } from "./../iterables";

import { concatMutable } from "./concat";
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
    return _random(prob, target);

  return Transformer(
    (acc, next, ...args) =>
      (Math.random() < prob)? step(target, acc, next, ...args): acc,

    acc => complete(target, acc),

    () => init(target)
  );
}, 2, false, placeholder);

/**
 * @private @function _random
 * - private version of random that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 *
 * @see @function random
 *
 * @throws TypeError
 * - target is not an iterable
 */
const _random = (prob, target) => {
  if (!isIterable(target))
    throw new Error(`Cannot get random elements from non-iterable ${target}!`);

  let result = empty(target);

  const iterator = getIterator(target);
  for (let item = iterator.next(); !item.done; item = iterator.next())
    result = (Math.random() < prob)? concatMutable(item.value, result): result;

  return result;
};
