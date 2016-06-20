import { isFunction } from "./../../utils/checks";
import { currify } from "./../curry";
import { concatMutable, empty } from "./../algebraic";
import { reduce } from "./../iterables";

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
    concatMutable(acc, next): acc,
  empty(target),
  target
);
