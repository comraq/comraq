import { isObject, isMap } from "./../../utils/checks";
import { currify, placeholder } from "./../curry";
import { getProp, hasProp } from "./../prop";
import { empty } from "./../algebraic";
import { reduce } from "./../iterables";

import { concatMutable } from "./concat";
import {
  step, complete, init,
  default as Transformer,
  isTransformer
} from "./Transformer";

/**
 * @public @function replace
 * - replace elements from an iterable collection which matches the key of
 *   an object or map object with the corresponding value
 *
 * @param {Object|Map} map
 * - the object/map providing the replacement key value pairs
 *
 * @param {Transformer|Iterable|Functor|Monoid} target
 * - the transformer or target iterable/functor
 *
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a new iterable with elements matching keys in map replaced by
 *   the corresponding values
 *
 * @throws TypeError
 * - map is not of type Object or Map
 */
export default currify((map, target) => {
  if (!isMap(map) && !isObject(map))
    throw new TypeError(
      "replace cannot be applied without providing a replacement map or object!"
    );

  if (!isTransformer(target))
    return _replace(map, target);

  return Transformer(
    (acc, next, ...args) => step(
      target,
      acc,
      (hasProp(next, map))? getProp(next, map): next,
      ...args
    ),

    acc => complete(target, acc),

    () => init(target)
  );
}, 2, false, placeholder);

/**
 * @private @function _replace
 * - private version of replace that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 * - uses the iterables's reduce to iterate and replace elements in iterable
 *   if found
 *
 * @see @function replace
 * @see @function iterables/reduce
 */
const _replace = (map, target) => reduce(
  (acc, next) =>
    concatMutable((hasProp(next, map))? getProp(next, map): next, acc),
  empty(target),
  target
);
