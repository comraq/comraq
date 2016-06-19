import { isInstance, isFunction } from "./../../utils/checks";
import identity from "./../identity";

const transformerInit = Symbol.for("transformer-init");
const transformerCompletion = Symbol.for("transformer-completion");
const transformerStep = Symbol.for("transformer-step");

/**
 * @private @interface _Transformer
 * - the interface which the returned reducing functions of transducers must
 *   implement
 *
 * @param {Function} step
 * - the 2+ arity version of the reducing function
 *
 * @see @function step
 *
 * @param {Function} complete
 * - the 1 arity version of the reducing function
 *
 * @see @function copmlete
 *
 * @param {Function} init
 * - the 0 arity version of the reducing function
 *
 * @see @function init
 */
  /*
class _Transformer {
  constructor(step, complete, init) {
    this[transformerStep] = step;
    this[transformerCompletion] = complete;
    this[transformerInit] = init;
  }
}
*/
function _Transformer(step, complete, init) {
  step[transformerStep] = step;
  step[transformerCompletion] = complete;
  step[transformerInit] = init;
  return step;
}

/**
 * @public @function Transformer
 * - the public factory for _Transformer where the complete and init
 *   functions are optional
 *
 * @see @interface _Transformer
 *
 * @param {Function} complete (optional)
 * - defaults to calling the step function with the first argument
 *
 * @param {Function} init (optional)
 * - defaults to calling the step function with no arguments
 *
 * @returns {_Transformer}
 * - an instance implementing the _Transformer interface
 */
export default (
  step,
  complete = identity,
  init = () => step()
) => _Transformer(step, complete, init);

/**
 * @public @function step
 * - calls the step function of an instance implementing the
 *   _Transformer interface
 *
 * @param {_Transformer} target
 * - an instance implementing the _Transformer interface
 *
 * @param {Any} acc
 * - the accumulator passed to the step function 
 *
 * @param {Any} next
 * - the next element in the Iterable sequence passed to the step function
 *
 * @param {Any, variadic} ...args
 * - any remaining arguments passed to the step function
 *
 * @returns {Any}
 * - the return value of target's step function
 *
 * @throws TypeError
 * - if target does not implement the _Transformer interface
 */
export const step = (target, acc, next, ...args) => {
  if (!isTransformer(target))
    throw new TypeError(
      `${target} does not implement the Transformer interface`
    );

  return target[transformerStep](acc, next, ...args);
};

/**
 * @public @function complete
 * - calls the complete function of an instance implementing the
 *   _Transformer interface
 *
 * @param {_Transformer} target
 * - an instance implementing the _Transformer interface
 *
 * @param {Any} acc
 * - the accumulator passed to the complete function 
 *
 * @returns {Any}
 * - the return value of target's complete function
 *
 * @throws TypeError
 * - if target does not implement the _Transformer interface
 */
export const complete = (target, acc) => {
  if (!isTransformer(target))
    throw new TypeError(
      `${target} does not implement the Transformer interface`
    );

  return target[transformerCompletion](acc);
};

/**
 * @public @function init
 * - calls the init function of an instance implementing the
 *   _Transformer interface
 *
 * @param {_Transformer} target
 * - an instance implementing the _Transformer interface
 *
 * @returns {Any}
 * - the return value of target's init function
 *
 * @throws TypeError
 * - if target does not implement the _Transformer interface
 */
export const init = target => {
  if (!isTransformer(target))
    throw new TypeError(
      `${target} does not implement the Transformer interface`
    );

  return target[transformerInit]();
};

/**
 * @public @function isTransformer
 * - checks whether target is an instance or implements
 *   the _Transformer interface
 * 
 * @param {Any} target
 * - the target to check
 *
 * @returns {Boolean}
 * - true if target is an instance or implements the _Transformer interface,
 *   false otherwise
 */
export const isTransformer = target =>
  isFunction(target[transformerStep]) &&
  isFunction(target[transformerCompletion]) &&
  isFunction(target[transformerInit]);
  
