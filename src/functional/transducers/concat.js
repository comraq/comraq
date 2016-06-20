import Transformer from "./Transformer";
import { _concat, _concatMutable } from "./../algebraic/Monoid";
import { identity } from "./../algebraic";

// TODO: needs work, currently simple placeholders for tests

/**
 * @public @function concat
 * - the transformer version of _concat with acc and next arguments reversed
 *   for the transformer step version of the function
 *
 * @returns {Transfomer}
 * - concat augmented with the Transformer mixin
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
