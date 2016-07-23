import { isFunction, isIterable } from "./../../utils/checks";
import { currify, placeholder } from "./../curry";

import iterReduce from "./iterable-reduce";
import getIterator from "./get-iterator";
import { identity } from "./../algebraic";

/**
 * @public @function reduce
 * - reduce left against an iterable taking an reducer and an accumulator
 *
 * @param {Function} func
 * - the reducing function, reducer
 *
 * @param {Any} acc
 * - the initial accumulator
 *
 * @param {Iterable} iterable
 * - the iterable collection to be reduced
 *
 * @returns {Any}
 * - the accumulated result, same type as acc
 *
 * @throws TypeError
 * - reducer func, is not a function
 *
 * @throws TypeError
 * - iterable is not/does not implement the iterable interface
 */
export default currify((func, acc, iterable) => {
  if (!isFunction(func))
    throw new TypeError(
      "reduce cannot be applied without first specifying a function!"
    );

  else if (!isIterable(iterable))
    throw new TypeError(
      "reduce cannot be applied on a non-iterable!"
    );

  return iterReduce(func, acc, iterable);
}, 3, false, placeholder);

/**
 * @public @function reduce1
 * - same as reduce except without needing an accumulator by passing the
 *   first element in the iteration as the accumulator
 *
 * @see @function reduce
 *
 * @throws TypeError
 * - iterable is empty
 */
export const reduce1 = currify((func, iterable) => {
  if (!isFunction(func))
    throw new TypeError(
      "reduce1 cannot be applied without first specifying a function!"
    );

  else if (!isIterable(iterable))
    throw new TypeError(
      "reduce1 cannot be applied on a non-iterable!"
    );

  const iterator = getIterator(iterable);
  const first = iterator.next();
  if (first.done)
    throw new TypeError(
      "Cannot reduce1 aganist empty iterables!"
    );

  return iterReduce(func, first.value, iterable, 1, iterator);
}, 2, false, placeholder);

/**
 * @private @function _reduceR
 * - private helper method for implementing reduceRight and reduceRight1
 *   via reduce
 *
 * @param {Function} reducer
 * - the reducer function to be called during each iteration of reduce
 *
 * @returns {Any}
 * - a wrapper function passed to reduce that returns a function taking in
 *   the actual accumulator
 * - a chain series of partially applied wrapper functions are generated
 *   during reduce, at the end of which all gets called, executing the
 *   reducer in the "reverse" order
 */
const _reduceR = reducer => (prevFunc, val, index, source) => acc =>
  prevFunc(reducer(acc, val, index, source));

/**
 * @public @function reduceRight
 * - same as reduce except traversing the iterable in the reverse order
 *
 * @see @function reduce
 */
export const reduceRight = currify((func, acc, iterable) => {
  if (!isFunction(func))
    throw new TypeError(
      "reduceRight cannot be applied without first specifying a function!"
    );

  else if (!isIterable(iterable))
    throw new TypeError(
      "reduceRight cannot be applied on a non-iterable!"
    );

  const f = _reduceR(func);
  return iterReduce(f, identity, iterable)(acc);
}, 3, false, placeholder);

/**
 * @public @function reduceRight1
 * - reduceRight version of reduce1
 * - same as reduceRight except without needing an accumulator by passing the
 *   first element in the iteration as the accumulator
 *
 * @see @function reduce1
 * @see @function reduceRight
 */
export const reduceRight1 = currify((func, iterable) => {
  if (!isFunction(func))
    throw new TypeError(
      "reduceRight1 cannot be applied without first specifying a function!"
    );

  else if (!isIterable(iterable))
    throw new TypeError(
      "reduceRight1 cannot be applied on a non-iterable!"
    );

  let last = { done: true, value: undefined };
  const proxy = function* proxy(iterable) {
    let iterator = getIterator(iterable);

    let item = iterator.next();
    if (item.done) {
      yield item.value;
      return;
    }

    let prev = iterator.next();
    while (!prev.done) {
      yield item.value;
      item = prev;
      prev = iterator.next();
    }
    last = item;

    return;
  };

  const f = _reduceR(func);
  const res = iterReduce(f, identity, iterable, 0, proxy(iterable));
  if (last.done)
    throw new TypeError(
      "Cannot reduceRight1 aganist empty iterables!"
    );

  return res(last.value);
}, 2, false, placeholder);
