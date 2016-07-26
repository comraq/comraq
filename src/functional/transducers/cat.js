import { isReduced, default as Reduced } from "./Transformer";
import { reduce } from "./../iterables";

import {
  complete, init,
  default as Transformer,
  isTransformer
} from "./Transformer";

/**
 * @public @function cat
 * - the transducer version of concat by calling reduce on each next element
 *   of the iteration, assusming that each is a collection itself
 *
 * @param {Transformer} target
 * - takes a collection of collections and "flattens" it by 1 level
 *
 * @returns {Transfomer}
 * - a transformer that will "flatten" nested collection/iterations
 *
 * @see @mixin Transformer
 *
 * @throws TypeError
 * - if target is not a instance of Transformer mixin
 */
export default target => {
  if (!isTransformer(target))
    throw new TypeError(
      `Non-transformer ${target} is supplied to concat Transducer!`
    );

  return Transformer(
    (acc, next) => reduce(target, acc, next),

    acc => complete(target, acc),

    () => init(target)
  );
};

/**
 * @private @function _preserveReduced
 * - internal function to check and re-wrap target if it's is already
 *   Reduced
 *
 * @param {Any} target
 * - the target to check
 *
 * @return {Any}
 * - the target param but double wrapped if already Reduced
 */
const _preserveReduced = target =>
  (isReduced(target))? Reduced(target): target;
