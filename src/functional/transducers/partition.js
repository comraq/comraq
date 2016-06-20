import {
  isNumber,
  isUndefined,
  isIterable
} from "./../../utils/checks";

import { currify } from "./../curry";
import { getIterator } from "./../iterables";
import { concatMutable, empty } from "./../algebraic";
import { length } from "./../strings";

import { ensureUnreduced } from "./Reduced";
import {
  step, complete, init,
  isTransformer, 
  default as Transformer
} from "./Transformer";

/**
 * @public @function partitionAll
 * - partitions an iterable into many smaller iterables as specified by size
 * 
 * @param {Number} size
 * - the size/number of elements in each partition
 *
 * @param {Transformer|Iterable} target
 * - the target transformer or iterable
 *
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - an iterable with partitions each of 'size' number of iterables,
 *   last partition may be smaller than 'size' if target iterable's total
 *   number of elements is not divisible by size
 *
 * @throws TypeError
 * - size of each partition is not a number
 */
export const partitionAll = currify((size, target) => {
  if (!isNumber(size))
    throw new TypeError(
      `Cannot take elements with a non-number limit ${size}!`
    );

  else if (!isTransformer(target))
    return _partitionAll(size, target);

  // Partition is undefined for now as we currently have no access to the
  // unit/void/empty instance of the accumulator until the step function of
  // the transformer is actually called
  let count = 0, partition = undefined;

  return Transformer(
    (acc, next, ...args) => {
      partition = (isUndefined(partition))? empty(acc): partition;

      if (count++ < size)
        partition = concatMutable(partition, next);

      else {
        const temp = partition;
        count = 1;
        partition = concatMutable(empty(acc), next);
        return step(target, acc, temp, ...args);
      }   

      return acc;
    },

    acc => {
      if (!isUndefined(partition) && length(partition) > 0)
        acc = ensureUnreduced(step(target, acc, partition));

      return complete(target, acc);
    },

    () => init(target)
  );
});

/**
 * @private @function _partitionAll
 * - private version of partitionAll that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 *
 * @see @function partitionAll
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */
const _partitionAll = (size, target) => {
  if (!isIterable(target))
    throw new TypeError(
      `Cannot takeWhile elements from non-iterable ${target}!`
    );

  let count = 0, partition = empty(target);

  const iterator = getIterator(target);
  let result = empty(target);

  let item = iterator.next();
  while (!item.done) {
    if (count++ < size)
      partition = concatMutable(partition, item.value);

    else {
      const temp = partition;
      count = 1;
      partition = concatMutable(empty(target), item.value);
      target = concatMutable(result, temp);
    }   

    item = iterator.next();
  }

  if (length(partition) > 0)
    result = concatMutable(result, partition);

  return result;
};
