import {
  isNumber,
  isUndefined,
  isIterable,
  isFunction
} from "./../../utils/checks";

import { curry, placeholder, empty } from "./../library";
import { getIterator } from "./../iterables";
import { length } from "./../strings";
import { pushMutable } from "./../arrays";

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
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - a generator yielding partitions each of 'size' number of iterables,
 *   last partition may be smaller than 'size' if target iterable's total
 *   number of elements is not divisible by size
 *
 * @throws TypeError
 * - size of each partition is not a number
 */
export const partitionAll = curry((size, target) => {
  if (!isNumber(size))
    throw new TypeError(
      `Cannot partitionAll with a non-number ${size}!`
    );

  else if (!isTransformer(target))
    return _partitionAllGen(size, target);

  // Partition is undefined for now as we currently have no access to the
  // unit/void/empty instance of the accumulator until the step function of
  // the transformer is actually called
  let count = 0, partition = undefined;

  return Transformer(
    (acc, next, ...args) => {
      partition = (isUndefined(partition))? empty(acc): partition;

      if (count++ < size)
        partition = pushMutable(next, partition);

      else {
        const temp = partition;
        count = 1;
        partition = pushMutable(next, empty(acc));
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
}, 2, placeholder);

/**
 * @private @function _partitionAllGen
 * - private version of partitionAll returning a generator
 *
 * @see @function partitionAll
 *
 * @returns {Generator}
 * - a generator that will lazily yield all values in the sequence in
 *   partitions specified by size
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */
function* _partitionAllGen(size, target) {
  if (!isIterable(target))
    throw new TypeError(
      `Cannot partitionAll of non-iterable ${target}!`
    );

  let count = 0, partition = empty(target);

  const iterator = getIterator(target);
  let result;

  let item = iterator.next();
  while (!item.done) {
    if (count++ < size)
      partition = pushMutable(item.value, partition);

    else {
      result = yield partition;
      count = 1;
      partition = pushMutable(item.value, empty(target));
    }

    item = iterator.next(result);
  }

  if (length(partition) > 0)
    yield partition;

  return;
}

/**
 * @public @function partitionBy
 * - partitions an iterable into many smaller iterables divided by everytime
 *   predicate returns a new value
 * - like other functions, this also passes the index and original iterable
 *   to the predicate function as the second and third argument
 *
 * @param {Function} predicate
 * - the predicate function to check on each element in iterable
 *
 * @param {Transformer|Iterable} target
 * - the target transformer or iterable
 *
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - generator yielding partitions of elements divided by when predicate
 *   function returns a different value
 *
 * @throws TypeError
 * - predicate argument is not a function
 */
export const partitionBy = curry((predicate, target) => {
  if (!isFunction(predicate))
    throw new TypeError(
      `Cannot partitionBy with non-function ${predicate}!`
    );

  else if (!isTransformer(target))
    return _partitionByGen(predicate, target);

  // Partition is undefined for now as we currently have no access to the
  // unit/void/empty instance of the accumulator until the step function of
  // the transformer is actually called
  let val = undefined, partition = undefined;

  return Transformer(
    (acc, next, ...args) => {
      let nextVal = predicate(next, ...args);

      if (isUndefined(partition)) {
        partition = pushMutable(next, empty(acc));
        val = nextVal;
        return acc;
      }

      if (val === nextVal) {
        partition = pushMutable(next, partition);

      } else {
        const temp = partition;
        partition = pushMutable(next, empty(acc));
        val = nextVal;
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
}, 2, placeholder);

/**
 * @private @function _partitionByGen
 * - private version of partitionBy returning a generator
 *
 * @see @function partitionBy
 *
 * @returns {Generator}
 * - a generator that will lazily yield all values in the sequence separated
 *   into partitions every time predicate function returns a different value
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */
function* _partitionByGen(predicate, target) {
  if (!isIterable(target))
    throw new TypeError(
      `Cannot partitionAll of non-iterable ${target}!`
    );

  const iterator = getIterator(target);
  let item = iterator.next();

  let val, partition, result;

  for (let index = 0; !item.done; ++index) {
    let nextVal = predicate(item.value, index, target);

    if (index === 0) {
      partition = pushMutable(item.value, empty(target));
      val = nextVal;

    } else if (val === nextVal)
      partition = pushMutable(item.value, partition);

    else {
      result = yield partition;
      partition = pushMutable(item.value, empty(target));
      val = nextVal;
    }

    item = iterator.next(result);
  }

  if (!isUndefined(partition))
    yield partition;

  return;
}
