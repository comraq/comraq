import Transformer from "./Transformer";
import { isReduced, default as Reduced } from "./Transformer";
import { _concat, _concatMutable } from "./../algebraic/Monoid";
import { identity } from "./../algebraic";

/**
 * @public @function concat
 * - the transformer version of _concat with acc and next arguments reversed
 *   for the transformer step version of the function
 *
 * @returns {Transfomer}
 * - _concat augmented with the Transformer mixin
 *
 * @see @function algebraic/concat
 * @see @mixin Transformer
 */
export default Transformer(
  _concat,
  identity,
  _concat,
  (acc, next) => _concat(next, acc)
);

/**
 * @public @function concatMutable
 * - the transformer version of _concatMutable with acc and next arguments
 *   reversed for the transformer step version of the function
 *
 * @returns {Transfomer}
 * - concatMutable augmented with the Transformer mixin
 *
 * @see @function algebraic/concatMutable
 * @see @mixin Transformer
 */
export const concatMutable = Transformer(
  _concatMutable,
  identity,
  _concatMutable,
  (acc, next) => _concatMutable(next, acc)
);

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
