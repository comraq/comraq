import { isNumber, isFunction, isIterable } from "./../../utils/checks";
import { currify, placeholder } from "./../curry";
import { getIterator } from "./../iterables";
import { empty } from "./../algebraic";

import { concatMutable } from "./concat";
import {
  step, complete, init,
  isTransformer, 
  default as Transformer
} from "./Transformer";

/**
 * @public @function drop
 * - drops the first 'number' of elements from an iterable specified
 *   by num and returns the rest
 * 
 * @param {Number} total
 * - the count of elements to drop from iterable
 *
 * @param {Transformer|Iterable} target
 * - the target transformer or iterable
 *
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - an iterable without the first 'total' number of elements from the target
 *   iterable or all elements if total number of elements <= 'number'
 *
 * @throws TypeError
 * - total number to take is not a number
 */
export default currify((total, target) => {
  if (!isNumber(total))
    throw new TypeError(
      `Cannot drop elements with a non-number limit ${total}!`
    );

  else if (!isTransformer(target))
    return _drop(total, target);

  let count = 0;

  return Transformer(
    (acc, next, ...args) => {
      if (++count <= total)
        return acc;

      return step(target, acc, next, ...args);
    },

    acc => complete(target, acc),

    () => init(target)
  );
}, 2, false, placeholder);

/**
 * @private @function _drop
 * - private version of drop that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 *
 * @see @function drop
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */
const _drop = (num, target) => {
  if (!isIterable(target))
    throw new TypeError(`Cannot drop elements from non-iterable ${target}!`);

  const iterator = getIterator(target);
  let result = empty(target);

  let i = 0;
  let item = iterator.next();

  while (++i <= num)
    item = iterator.next();

  while (!item.done) {
    result = concatMutable(item.value, result);
    item = iterator.next();
  }

  return result;
};

/**
 * @public @function dropWhile
 * - drops elements from the beginning of an iterable while the predicate
 *   holds true and returns the remaining of the elements in the iterable
 * - like other functions, this also passes the index and original iterable
 *   to the predicate function as the second and third argument
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
 * - if target is an iterable, returns an iterable without the beginning
 *   iteration sequence while predicate holds true
 *
 * @throws TypeError
 * - predicate is not a function
 */
export const dropWhile = currify((predicate, target) => {
  if (!isFunction(predicate))
    throw new TypeError(
      `Cannot dropWhile elements with non-function predicate ${predicate}!`
    );

  if (!isTransformer(target))
    return _dropWhile(predicate, target);

  let dropped = false;
  return Transformer(
    (acc, next, ...args) => {
      if (!dropped && predicate(next, ...args))
        return acc;

      dropped = true;
      return step(target, acc, next, ...args);
    },

    acc => complete(target, acc),

    () => init(target)
  );
}, 2, false, placeholder);

/**
 * @private @function _dropWhile
 * - private version of dropWhile that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 *
 * @see @function dropWhile
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */
const _dropWhile = (predicate, target) => {
  if (!isIterable(target))
    throw new TypeError(
      `Cannot dropWhile elements from non-iterable ${target}!`
    );

  const iterator = getIterator(target);
  let result = empty(target);

  let item = iterator.next(), i = 0;
  while (predicate(item.value, i++, target) && !item.done)
    item = iterator.next();

  while (!item.done) {
    result = concatMutable(item.value, result);
    item = iterator.next();
  }

  return result;
};
