import { isFunction, isIterable } from "./../../utils/checks";
import { types } from "./../../utils";
import { currify, placeholder } from "./../curry";
import { empty } from "./../algebraic";
import { reduce, getIterator } from "./../iterables";

import { concatMutable } from "./concat";
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
    return (function* () { yield* _filterGen(predicate, target); })();

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
 * - a generator that will lazily yield only the values in the sequence that
 *   returns true for the predicate filter
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
    return (function* () { yield* _removeGen(predicate, target); })();

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
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a new iterable with all elements filtered to only occur once,
 *   preserving the order of elements by its first occurence
 */
export const distinct = target => {
  if (!isTransformer(target))
    return _distinct(target);

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
 * @private @function _distinct
 * - private version of distinct that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 *
 * @see @function distinct
 *
 * @throws TypeError
 * - target is not an iterable
 */
const _distinct = target => {
  if (!isIterable(target))
    throw new Error(`Cannot get distinct elements of non-iterable ${target}!`);

  const set = new Set();
  let result = empty(target);

  const iterator = getIterator(target);
  let item = iterator.next();
  while (!item.done) {
    if (!set.has(item.value)) {
      result = concatMutable(item.value, result);
      set.add(item.value);
    }

    item = iterator.next();
  }

  return result;
};

/**
 * @public @function dedupe
 * - transforms a collection into a set by removing all consecutive
 *   duplicate occurences
 *
 * @param {Transformer|Iterable|Monoid} target
 * - the target iterable/functor
 *
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a new iterable with all elements having consecutive duplicates
 *   removed to occur only once
 */
export const dedupe = target => {
  if (!isTransformer(target))
    return _dedupe(target);

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
 * @private @function _dedupe
 * - private version of depdupe that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 *
 * @see @function dedupe
 *
 * @throws TypeError
 * - target is not an iterable
 */
const _dedupe = target => {
  if (!isIterable(target))
    throw new Error(`Cannot deduplicate elements of non-iterable ${target}!`);

  let result = empty(target);
  let prev = {};

  const iterator = getIterator(target);
  let item = iterator.next();
  while (!item.done) {
    if (item.value !== prev) {
      result = concatMutable(item.value, result);
      prev = item.value;
    }

    item = iterator.next();
  }

  return result;
};

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
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a new iterable with all elements filtered and left out those
 *   that returned null or undefined when applied with the predicate function
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
    return _keep(predicate, target);

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
 * @private @function _keep
 * - private version of keep that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 * - uses the iterables's reduce to carry out the filtering across
 *   all elements in the iterable
 *
 * @see @function keep
 * @see @function iterables/reduce
 */
const _keep = (predicate, target, i = 0) => reduce(
  (acc, next, index, target) => {
    let result = predicate(next, index, target, i++);

    let type = types.toString(result);
    return (type === types.sNull || type === types.sUndefined)?
      acc: concatMutable(next, acc);
  },
  empty(target),
  target
);
