import { isFunction, isIterable } from "./../../utils/checks";
import { currify } from "./../curry";
import iterReduce from "./iterable-reduce";
import getIterator from "./get-iterator";
import reverseIterable from "./reverse";

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
 * @throws Error
 * - reducer func, is not a function
 *
 * @throws Error
 * - iterable is not/does not implement the iterable interface
 */
export default currify((func, acc, iterable) => {
  if (!isFunction(func))
    throw new Error(
      "reduce1 cannot be applied without first specifying a function!"
    );

  else if (isFunction(iterable.reduce))
    return iterable.reduce(func, acc);

  else if (!isIterable(iterable))
    throw new Error(
      "reduce1 cannot be applied on a non-iterable!"
    );

  return iterReduce(func, acc, iterable);
});

/**
 * @public @function reduce1
 * - same as reduce except without needing an accumulator by passing the
 *   first element in the iteration as the accumulator
 *
 * @see @function reduce
 */
export const reduce1 = currify((func, iterable) => {
  if (!isFunction(func))
    throw new Error(
      "reduce1 cannot be applied without first specifying a function!"
    );

  else if (isFunction(iterable.reduce))
    return iterable.reduce(func);

  else if (!isIterable(iterable))
    throw new Error(
      "reduce1 cannot be applied on a non-iterable!"
    );

  const iterator = getIterator(iterable);
  return iterReduce(func, iterator.next().value, iterable, 1, iterator);
});

/**
 * @public @function reduceRight
 * - same as reduce except traversing the iterable in the reverse order
 *
 * @see @function reduce
 */
export const reduceRight = currify((func, acc, iterable) => {
  if (!isFunction(func))
    throw new Error(
      "reduceRight cannot be applied without first specifying a function!"
    );

  else if (isFunction(iterable.reduceRight))
    return iterable.reduceRight(func, acc);

  else if (!isIterable(iterable))
    throw new Error(
      "reduceRight cannot be applied on a non-iterable!"
    );

  iterable = reverseIterable(iterable);
  return iterReduce(func, acc, iterable);
});

/**
 * @public @function reduceRight1
 * - same as reduceRight except without needing an accumulator by passing the
 *   first element in the iteration as the accumulator
 *
 * @see @function reduceRight
 */
export const reduceRight1 = currify((func, iterable) => {
  if (!isFunction(func))
    throw new Error(
      "reduceRight1 cannot be applied without first specifying a function!"
    );

  else if (isFunction(iterable.reduceRight))
    return iterable.reduceRight(func);

  else if (!isIterable(iterable))
    throw new Error(
      "reduceRight1 cannot be applied on a non-iterable!"
    );

  iterable = reverseIterable(iterable);
  const iterator = getIterator(iterable);

  return iterReduce(func, iterator.next().value, iterable, 1, iterator);
});
