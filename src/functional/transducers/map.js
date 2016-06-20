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
 * @public @function map
 * - map a function against a functor, a Monoid
 *   or all elements of an iterable collection
 *
 * @param {Function} func
 * - the mapping function applied against each element in the iterable
 *
 * @param {Transformer|Iterable|Functor|Monoid} target
 * - the transformer or target iterable/functor
 *
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a new iterable with all elements
 *   applied with the mapping functon
 *
 * @throws TypeError
 * - mapping function func is not a function
 */
export default currify((func, target) => {
  if (!isFunction(func))
    throw new TypeError(
      "map cannot be applied without first specifying a function!"
    );

  if (!isTransformer(target))
    return _map(func, target);

  return Transformer(
    (acc, next, ...args) => step(target, acc, func(next), ...args),

    acc => complete(target, acc),

    () => init(target)
  );
});

/**
 * @private @function _map
 * - private version of map that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 * - uses the iterables's reduce to carry out the mapping function across
 *   all elements in the iterable
 *
 * @see @function map
 * @see @function iterables/reduce
 */
const _map = (func, target) => reduce(
  (acc, next, index, target) => concatMutable(func(next, index, target), acc),
  empty(target),
  target
);
