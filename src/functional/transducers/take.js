import { isNumber, isFunction, isIterable } from "./../../utils/checks";
import { currify, placeholder } from "./../curry";
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
 *   iterable or all elements if total number of elements <= 'number'
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
}, 2, false, placeholder);

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
}, 2, false, placeholder);

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

/**
 * @public @function takeNth
 * - gets every nth element from of an iterable specified by
 *   a numerical starting posiiton/index
 * 
 * @param {Number} n
 * - the number of elements to skip before taking from the iterable, must be
 *   positive ( n >= 0 )
 *
 * @param {Number} start (optional)
 * - the starting position/index of the iterable to take from (inclusive)
 * - start = 0, --> (default) starts and takes the 0th element from the iterable
 * - start < 0, --> starts from the negative value, skipping every n
 *                  elements, and only begin taking element when index becomes
 *                  positive
 * - start > 0, --> skips all elements from the head of the iterable
 *                  sequence and starts by taking the start-th element, then
 *                  skipping every n elements
 * - @example
 *   let arr = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l" ];
 *
 *   // Take every 5th starting with 0th
 *   takeNth(5, arr)        --> [ "a", "f", "k" ];
 *
 *   // Take every 5th starting with -1st
 *   takeNth(5, -1)(arr)    --> [ "e", "j" ];
 *
 *   // Take every 3rd starting with -2nd
 *   takeNth(3, -2)(arr)    --> [ "b", "e", "h", "k" ];
 *
 *   // Take every 3rd starting with -2nd
 *   takeNth(3, 3)(arr)     --> [ "d", "g", "j" ];
 *
 *    // Take every 100th elements -> should be empty
 *   takeNth(100, -2)(arr)  --> [];
 *
 *   // Take every 1th elements -> should be same as original
 *   takeNth(1)(arr)        --> arr; 
 *
 * @param {Transformer|Iterable} target
 * - the target transformer or iterable
 *
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - if target is an iterable, returns an iterable with only every nth
 *   element starting from index start (start defaults to 0)
 */
export const takeNth = currify(function(n, start, target) {
  if (isIterable(start) || isTransformer(start))
    return _takeNth(n, 0, start);

  if (arguments.length > 2)
    return _takeNth(n, start, target);

  return target => _takeNth(n, start, target);
}, 2, false, placeholder);

/*
 * @private @function _takeNth
 * - private helper/repeated function of takeNth that returns the
 *   Transformer if target is of type transformer
 * - otherwise, the result is returned by __takeNth
 *
 * @see @public @function takeNth
 * @see @private @function __takeNth
 *
 * @throws TypeError
 * - n is a negative number
 * - start is not a number
 */
const _takeNth = (n, start, target) => {
  if (!isNumber(n) || n <= 0)
    throw new TypeError(
      `Cannot takeNth elements with an invalid n: '${n}'!`
    );

  else if (!isNumber(start))
    throw new TypeError(
      "Second argument to takeNth must be a starting index number, "
      + "transformer or iterable!"
    );

  if (start < 0)
    start %= n;

  if (!isTransformer(target))
    return __takeNth(n, start, target);

  let current = -1, i = 0, started = (start < 0)? true: false;
  return Transformer(
    (acc, next, ...args) => {
      if (!started) {
        if (i++ === start) {
          started = true;
          current = start;
          return step(target, acc, next, ...args);
        }

        return acc;
      }

      if (++current - n === start) {
        current = start;
        return step(target, acc, next, ...args);
      }

      return acc;
    },

    acc => complete(target, acc),

    () => init(target)
  );
};

/**
 * @private @function __takeNth
 * - private version of _takeNth that immediately returns the iterable
 *   result when the iterable is passed instead of a transformer mixin
 *
 * @see @function _takeNth
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */
const __takeNth = (n, start, target) => {
  if (!isIterable(target))
    throw new TypeError(
      `Cannot takeNth elements from non-iterable ${target}!`
    );

  const iterator = getIterator(target);
  let result = empty(target);

  let current = -1, i = 0, started = (start < 0)? true: false;
  let item = iterator.next();
  while (!item.done) {
    if (!started) {
      if (i++ === start) {
        started = true;
        current = start;
        result = concatMutable(item.value, result);
      }

    } else {
      if (++current - n === start) {
        current = start;
        result = concatMutable(item.value, result);
      }
    }
    item = iterator.next();
  }

  return result;
};
