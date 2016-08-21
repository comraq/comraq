import { isIterable } from "./../../utils/checks";
import { toString, sObject, sMap } from "./../../utils/types";
import { curry, placeholder, getProp, hasProp } from "./../library";
import { getIterator } from "./../iterables";

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
 * @returns {Transformer|Generator}
 * - returns transformer if target is an instance with the transformer mixin
 * - returns a generator yielding elements matching keys in map replaced by
 *   the corresponding values
 *
 * @throws TypeError
 * - map is not of type Object or Map
 */
export default curry((map, target) => {
  const type = toString(map);
  if (type !== sMap && type !== sObject)
    throw new TypeError(
      "replace cannot be applied without providing a replacement map or object!"
    );

  if (!isTransformer(target))
    return _replaceGen(map, target);

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
}, 2, placeholder);

/**
 * @private @function _replaceGen
 * - private version of replace returning a generator
 *
 * @see @function replace
 *
 * @returns {Generator}
 * - a generator that will lazily yield all elements in the sequence while
 *   replacing those found in map with the values from map if element is
 *   found as a key
 *
 * @throws TypeError
 * - target is not an iterable
 */
function* _replaceGen(map, target) {
  if (!isIterable(target))
    throw new Error(`Cannot keep elements of non-iterable ${target}!`);

  let result;

  const iterator = getIterator(target);
  let item = iterator.next();

  while (!item.done) {
    if (hasProp(item.value, map))
      result = yield getProp(item.value, map);

    else
      result = yield item.value;

    item = iterator.next(result);
  }

  return;
}
