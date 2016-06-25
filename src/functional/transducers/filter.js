import { isFunction } from "./../../utils/checks";
import { currify } from "./../curry";
import { empty } from "./../algebraic";
import { reduce } from "./../iterables";

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
 *   that returned false when applied with the predicate function
 *
 * @throws TypeError
 * - predicate function func is not a function
 */
export default currify((predicate, target) => {
  if (!isFunction(predicate))
    throw new Error(
      "filter cannot be applied without first specifying a predicate function!"
    );

  if (!isTransformer(target))
    return _filter(predicate, target);

  return Transformer(
    (acc, next, ...args) => (predicate(next))?
      step(target, acc, next, ...args): acc,

    acc => complete(target, acc),

    () => init(target)
  );
});

/**
 * @private @function _filter
 * - private version of filter that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 * - uses the iterables's reduce to carry out the filtering across
 *   all elements in the iterable
 *
 * @see @function filter
 * @see @function iterables/reduce
 */
const _filter = (predicate, target) => reduce(
  (acc, next, index, target) => (predicate(next, index, target))?
    concatMutable(next, acc): acc,
  empty(target),
  target
);

/**
 * @public @function remove
 * - remove against a functor, a Monoid or an iterable collection
 *   by applying a predicate function against all elements of the iteration
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
    return _remove(predicate, target);

  return Transformer(
    (acc, next, ...args) => (predicate(next))?
      acc: step(target, acc, next, ...args),

    acc => complete(target, acc),

    () => init(target)
  );
});

/**
 * @private @function _remove
 * - private version of remove that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 * - uses the iterables's reduce to carry out the removing across
 *   all elements in the iterable
 *
 * @see @function remove
 * @see @function iterables/reduce
 */
const _remove = (predicate, target) => reduce(
  (acc, next, index, target) => (predicate(next, index, target))?
    acc: concatMutable(next, acc),
  empty(target),
  target
);
