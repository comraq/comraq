import { isFunction, isIterable } from "./../../utils/checks";
import { types } from "./../../utils";
import { currify, placeholder } from "./../curry";
import { getIterator } from "./../iterables";

import {
  step, complete, init,
  default as Transformer,
  isTransformer
} from "./Transformer";

/**
 * @public @function filter
 * - filter against a functor, a Monoid or an iterable collection
 *   by applying a predicate function against all elements of the iteration
 * - like other functions, this also passes the index and original iterable
 *   to the predicate function as the second and third argument
 *
 * @param {Function} predicate
 * - the predicate function applied against each element in the iterable
 *
 * @param {Transformer|Iterable|Monoid} target
 * - the target iterable/functor
 *
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a new iterable with all elements filtered and left out those
 *   that returned false when applied with the predicate function
 * - returns a lazy generator which will yield all elements from original
 *   sequence that returns true when applied with the predicate functon
 *
 * @throws TypeError
 * - predicate function is not a function
 */
export default currify((predicate, target) => {
  if (!isFunction(predicate))
    throw new Error(
      "filter cannot be applied without first specifying a predicate function!"
    );

  if (!isTransformer(target))
    return _filterGen(predicate, target);

  return Transformer(
    (acc, next, ...args) => (predicate(next, ...args))?
      step(target, acc, next, ...args): acc,

    acc => complete(target, acc),

    () => init(target)
  );
}, 2, false, placeholder);

/**
 * @private @function _filterGen
 * - private version of filter returning a generator
 *
 * @see @function @filter
 *
 * @returns {Generator}
 * - a generator that will lazily yield only values in the sequence that
 *   returns true for the predicate filter
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */
function* _filterGen(predicate, target) {
  if (!isIterable(target))
    throw new Error(`Cannot filter over non-iterable ${target}!`);

  const iterator = getIterator(target);
  let item = iterator.next(), result;
  for (let index = 0; !item.done; ++index) {
    if (predicate(item.value, index, target))
      result = yield item.value;

    else
      result = undefined;

    item = iterator.next(result);
  }

  return;
}

/**
 * @public @function remove
 * - remove against a functor, a Monoid or an iterable collection
 *   by applying a predicate function against all elements of the iteration
 * - like other functions, this also passes the index and original iterable
 *   to the predicate function as the second and third argument
 *
 * @param {Function} predicate
 * - the predicate function applied against each element in the iterable
 *
 * @param {Transformer|Iterable|Monoid} target
 * - the target iterable/functor
 *
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a new iterable with all elements removed, leaving out those
 *   that returned true when applied with the predicate function
 *
 * @throws TypeError
 * - predicate function func is not a function
 */
export const remove = currify((predicate, target) => {
  if (!isFunction(predicate))
    throw new Error(
      "remove cannot be applied without first specifying a predicate function!"
    );

  if (!isTransformer(target))
    return _removeGen(predicate, target);

  return Transformer(
    (acc, next, ...args) => (predicate(next, ...args))?
      acc: step(target, acc, next, ...args),

    acc => complete(target, acc),

    () => init(target)
  );
}, 2, false, placeholder);

/**
 * @private @function _removeGen
 * - private verson of remove returning a generator
 *
 * @see @function @remove
 *
 * @returns {Generator}
 * - a generator that will lazily yield all values in the sequence that
 *   returns false when evaluated with the predicate
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */
function* _removeGen(predicate, target) {
  if (!isIterable(target))
    throw new Error(`Cannot remove from non-iterable ${target}!`);

  const iterator = getIterator(target);
  let item = iterator.next(), result;
  for (let index = 0; !item.done; ++index) {
    if (predicate(item.value, index, target))
      result = undefined;

    else
      result = yield item.value;

    item = iterator.next(result);
  }

  return;
}

/**
 * @public @function distinct
 * - transforms a collection into a set by removing all second+ occurences
 *
 * @param {Transformer|Iterable|Monoid} target
 * - the target iterable/functor
 *
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a generator yielding all elements from iterable sequence filtered
 *   to only occur once, preserving the order of elements by its first
 *   occurence
 */
export const distinct = target => {
  if (!isTransformer(target))
    return _distinctGen(target);

  const set = new Set();
  return Transformer(
    (acc, next, ...args) => {
      if (set.has(next))
        return acc;

      set.add(next);
      return step(target, acc, next, ...args);
    },

    acc => complete(target, acc),

    () => init(target)
  );
};

/**
 * @private @function _distinctGen
 * - private version of distinct returning a generator
 *
 * @see @function distinct
 *
 * @returns {Generator}
 * - a generator that will lazily yield all values in the sequence omitting
 *   any duplicates
 *
 * @throws TypeError
 * - target is not an iterable
 */
function* _distinctGen(target) {
  if (!isIterable(target))
    throw new Error(`Cannot get distinct elements of non-iterable ${target}!`);

  const set = new Set();
  let result;

  const iterator = getIterator(target);
  let item = iterator.next();
  while (!item.done) {
    if (!set.has(item.value)) {
      result = yield item.value;
      set.add(item.value);

    } else
      result = undefined;

    item = iterator.next(result);
  }

  return;
}

/**
 * @public @function dedupe
 * - transforms a collection into a set by removing all consecutive
 *   duplicate occurences
 *
 * @param {Transformer|Iterable|Monoid} target
 * - the target iterable/functor
 *
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a generator yielding all elements from iterable sequence having
 *   consecutive duplicates removed to occur only once
 */
export const dedupe = target => {
  if (!isTransformer(target))
    return _dedupeGen(target);

  let prev = {};
  return Transformer(
    (acc, next, ...args) => {
      if (next === prev)
        return acc;

      prev = next;
      return step(target, acc, next, ...args);
    },

    acc => complete(target, acc),

    () => init(target)
  );
};

/**
 * @private @function _dedupeGen
 * - private version of depdupe returning a generator
 *
 * @see @function dedupe
 *
 * @returns {Generator}
 * - a generator that will lazily yield all values in the sequence omitting
 *   any consecutive duplicates
 *
 * @throws TypeError
 * - target is not an iterable
 */
function* _dedupeGen(target) {
  if (!isIterable(target))
    throw new Error(`Cannot deduplicate elements of non-iterable ${target}!`);

  let result;
  let prev = {};

  const iterator = getIterator(target);
  let item = iterator.next();
  while (!item.done) {
    if (item.value !== prev) {
      result = yield item.value;
      prev = item.value;

    } else
      result = undefined;

    item = iterator.next(result);
  }

  return;
}

/**
 * @public @function keep
 * - filter against a functor, a Monoid or an iterable collection
 *   by applying a predicate function against all elements of the
 *   iteration, keeping only those that return non-null and non-undefined
 *   values
 * - in addition, this also passes the index, original iterable and the number
 *   of times the predicate function to keep was called as the second and
 *   third, and fourth argument
 *
 * @param {Function} predicate
 * - the predicate function applied against each element in the iterable
 *
 * @param {Transformer|Iterable|Monoid} target
 * - the target iterable/functor
 *
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a generator yielding all elements from iterable sequence and leave
 *   out those that returned null or undefined when applied with the
 *   predicate function
 *
 * @throws TypeError
 * - predicate function func is not a function
 */
export const keep = currify((predicate, target) => {
  if (!isFunction(predicate))
    throw new Error(
      "keep cannot be applied without first specifying a predicate function!"
    );

  if (!isTransformer(target))
    return _keepGen(predicate, target);

  let i = 0;
  return Transformer(
    (acc, next, ...args) => {
      let result = predicate(next, ...args, i++);

      let type = types.toString(result);
      return (type === types.sNull || type === types.sUndefined)?
        acc: step(target, acc, next, ...args);
    },

    acc => complete(target, acc),

    () => init(target)
  );
}, 2, false, placeholder);

/**
 * @private @function _keepGen
 * - private version of keep returning a generator
 *
 * @see @function keep
 *
 * @returns {Generator}
 * - a generator that will lazily yield all values in the sequence that
 *   returns a non-null or non-undefined value when applied with predicate
 *
 * @throws TypeError
 * - target is not an iterable
 */
function* _keepGen(predicate, target, i = 0) {
  if (!isIterable(target))
    throw new Error(`Cannot keep elements of non-iterable ${target}!`);

  let result;

  const iterator = getIterator(target);
  let item = iterator.next();
  for (let index = 0; !item.done; ++i) {
    let value = predicate(item.value, index, target, i++);

    let vType = types.toString(value);
    if (vType === types.sNull || vType === types.sUndefined)
      result = undefined;

    else
      result = yield item.value;

    item = iterator.next(result);
  }

  return;
}
