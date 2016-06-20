import { isNumber, isFunction, isIterable } from "./../../utils/checks";
import { currify } from "./../curry";
import { getIterator } from "./../iterables";
import { empty } from "./../algebraic";

import { concatMutable } from "./concat";
import { ensureReduced } from "./Reduced";
import {
  step, complete, init,
  isTransformer, 
  default as Transformer
} from "./Transformer";

/**
 * @public @function take
 * - gets the first 'number' of elements from an iterable specified
 *   by num
 * 
 * @param {Number} total
 * - the count of elements to take from iterable
 *
 * @param {Transformer|Iterable} target
 * - the target transformer or iterable
 *
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - an iterable with the first 'total' number of elements from the target
 *   iterable or all elements if total number of elements < 'number'
 *
 * @throws TypeError
 * - total number to take is not a number
 */
export default currify((total, target) => {
  if (!isNumber(total))
    throw new TypeError(
      `Cannot take elements with a non-number limit ${total}!`
    );

  else if (!isTransformer(target))
    return _take(total, target);

  let count = 0;

  return Transformer(
    (acc, next, ...args) => {
      if (++count < total)
        return step(target, acc, next, ...args);

      else if (count === total)
        return ensureReduced(step(target, acc, next, ...args));

      return ensureReduced(acc);
    },

    acc => complete(target, acc),

    () => init(target)
  );
});

/**
 * @private @function _take
 * - private version of take that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 *
 * @see @function take
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */
const _take = (num, target) => {
  if (!isIterable(target))
    throw new TypeError(`Cannot take elements from non-iterable ${target}!`);

  const iterator = getIterator(target);
  let result = empty(target);

  let i = 0;
  let item = iterator.next();
  while (i++ < num && !item.done) {
    result = concatMutable(item.value, result);
    item = iterator.next();
  }

  return result;
};

/**
 * @public @function takeWhile
 * - gets elements from the beginning of an iterable while the predicate
 *   holds true
 * 
 * @param {Function} predicate
 * - the predicate function returning a Boolean value that is applied
 *   against the elements within the iterable
 *
 * @param {Transformer|Iterable} target
 * - the target transformer or iterable
 *
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - if target is an iterable, returns an iterable from the beginning of the
 *   iteration sequence while predicate holds true
 *
 * @throws TypeError
 * - predicate is not a function
 */
export const takeWhile = currify((predicate, target) => {
  if (!isFunction(predicate))
    throw new TypeError(
      `Cannot takeWhile elements with non-function predicate ${predicate}!`
    );

  if (!isTransformer(target))
    return _takeWhile(predicate, target);

  return Transformer(
    (acc, next, ...args) => {
      if (predicate(next))
        return step(target, acc, next, ...args);

      return ensureReduced(acc);
    },

    acc => complete(target, acc),

    () => init(target)
  );
});

/**
 * @private @function _takeWhile
 * - private version of takeWhile that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 *
 * @see @function takeWhile
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */
const _takeWhile = (predicate, target) => {
  if (!isIterable(target))
    throw new TypeError(
      `Cannot takeWhile elements from non-iterable ${target}!`
    );

  const iterator = getIterator(target);
  let result = empty(target);

  let item = iterator.next();
  while (predicate(item.value) && !item.done) {
    result = concatMutable(item.value, result);
    item = iterator.next();
  }

  return result;
};
