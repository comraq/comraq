import { autoCurry } from "./../curry";
import { init, isTransformer } from "./Transformer";
import { reduce } from "./../iterables";

/**
 * @public @function transduce
 * - calls transduce on a transducer, transformer given an initial value on
 *   a target collection
 *
 * @param {Function} transducer
 * - the composed transducer function with all transforms
 *
 * @param {Function|_Transformer} transformer
 * - the reducing transformer function
 *
 * @see @interface _Transformer
 *
 * @param {Any} init
 * - the inital value to be passed to reduce
 *
 * @param {Iterable} target
 * - the iterable target/collection
 *
 * @returns {Any}
 * - the accumulated result of the transduction process
 *
 * @throws TypeError
 * - if transformer does not implement the _Transformer interface
 */
const transduce = autoCurry(transducer => transformer => init => target => {
  if (!isTransformer(transformer))
    throw new TypeError(
      `transduce cannot be applied with non-Transformer ${transformer}!`
    );

  return reduce(_applyTransform(transducer, transformer), init, target);
});

export default transduce;

/**
 * @public @function transduce1
 * - alternate version of transduce without requiring the init value
 * - the init value is the result of a call to the init function of the
 *   transformer
 *
 * @see @function transduce
 */
export const transduce1 = autoCurry(transducer => transformer => target =>
  transduce(transducer, transformer, init(transformer), target));

/**
 * @private @function _applyTransform
 * - to be shared/used with other internal functions only!
 * - supplies the transformer into the transducer, producing a transformer
 *
 * @param {Function} transducer
 * - the target transducer
 *
 * @param {Function|_Transformer} transformer
 * - the target transfomer
 *
 * @returns {_Transformer}
 * - the resulting instance implementing the _Transformer interface
 *
 * @see @interface _Transformer
 *
 * @throws TypeError
 * - if the result does not implement the _Transformer interface
 */
export const _applyTransform = (transducer, transformer) => {
  let result = transducer(transformer);
  if (!isTransformer(result))
    throw new TypeError (
      "Invalid transducer! "
      + `${transducer} applied with transformer did not return a transformer!`
    );

  return result;
};
