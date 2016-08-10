import { isNumber, isFunction, isIterable } from "./../../utils/checks";
import { currify, placeholder } from "./../curry";
import { getIterator } from "./../iterables";

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
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - a generator yielding the first 'total' number of elements from the target
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
    return _takeGen(total, target);

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
 * @private @function _takeGen
 * - private version of take returning a generator
 *
 * @see @function take
 *
 * @returns {Generator}
 * - a generator that will lazily yield the first num values from the
 *   iterable sequence
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */
function* _takeGen(num, target) {
  if (!isIterable(target))
    throw new TypeError(`Cannot take elements from non-iterable ${target}!`);

  const iterator = getIterator(target);

  let i = 0;
  let item = iterator.next();
  while (i++ < num && !item.done) {
    let result = yield item.value;
    item = iterator.next(result);
  }

  return;
}

/**
 * @public @function takeWhile
 * - gets elements from the beginning of an iterable while the predicate
 *   holds true
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
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - a generator yielding values from the beginning of the iteration sequence
 *   while predicate holds true
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
    return _takeWhileGen(predicate, target);

  return Transformer(
    (acc, next, ...args) => {
      if (predicate(next, ...args))
        return step(target, acc, next, ...args);

      return ensureReduced(acc);
    },

    acc => complete(target, acc),

    () => init(target)
  );
}, 2, false, placeholder);

/**
 * @private @function _takeWhileGen
 * - private version of takeWhile returning a generator
 *
 * @see @function takeWhile
 *
 * @returns {Generator}
 * - a generator that will lazily yield values from the beginning of the
 *   sequence until predicate returns false when applied with value
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */
function* _takeWhileGen(predicate, target) {
  if (!isIterable(target))
    throw new TypeError(
      `Cannot takeWhile elements from non-iterable ${target}!`
    );

  const iterator = getIterator(target);
  let item = iterator.next(), i = 0;

  while (predicate(item.value, i++, target) && !item.done) {
    let result = yield item.value;
    item = iterator.next(result);
  }

  return;
}

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
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - a generator yielding only every nth element starting from index start
 *   (start defaults to 0)
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
    return __takeNthGen(n, start, target);

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
 * @private @function __takeNthGen
 * - private version of _takeNth returning a generator
 *
 * @see @function _takeNth
 *
 * @returns {Generator}
 * - a generator that will lazily yield only every nth values in the
 *   original iterable sequence
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */
function* __takeNthGen(n, start, target) {
  if (!isIterable(target))
    throw new TypeError(
      `Cannot takeNth elements from non-iterable ${target}!`
    );

  const iterator = getIterator(target);

  let current = -1, i = 0, started = (start < 0)? true: false;
  let item = iterator.next();

  let result;
  while (!item.done) {
    if (!started) {
      if (i++ === start) {
        started = true;
        current = start;
        result = yield item.value;
      }

    } else {
      if (++current - n === start) {
        current = start;
        result = yield item.value;

      } else
        result = undefined;

    }

    item = iterator.next(result);
  }

  return;
}
