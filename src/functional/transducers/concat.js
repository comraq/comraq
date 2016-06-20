import Transformer from "./Transformer";
import { concat, concatMutable as concatM } from "./../algebraic";

// TODO: needs work, currently simple placeholders for tests

/**
 * @public @function concat
 * - the transformer version of concat
 *
 * @returns {Transfomer}
 * - concat augmented with the Transformer mixin
 *
 * @see @function algebraic/concat
 * @see @mixin Transformer
 */
export default Transformer(concat);

/**
 * @public @function concatMutable
 * - the transformer version of concatMutable
 *
 * @returns {Transfomer}
 * - concatMutable augmented with the Transformer mixin
 *
 * @see @function algebraic/concatMutable
 * @see @mixin Transformer
 */
export const concatMutable = Transformer(concatM);
