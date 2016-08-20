import { isFunction } from "./../../utils/checks";
import { identity } from "./../library";

const transformerInit = Symbol.for("transformer-init");
const transformerCompletion = Symbol.for("transformer-completion");
const transformerStep = Symbol.for("transformer-step");

/**
 * @private @mixin _Transformer
 * - augments the original reducing function with the _Transformer mixin,
 *   adding complete, init and step functions for transducers to call
 *
 * @param {Function} reducer
 * - the original reducing function
 *
 * @param {Function} complete
 * - the 1 arity version of the reducing function
 *
 * @see @function complete
 *
 * @param {Function} init
 * - the 0 arity version of the reducing function
 *
 * @see @function init
 *
 * @param {Function} step
 * - the 2+ arity version of the reducing function
 *
 * @see @function step
 *
 * @return {Function}
 * - returns the original function after adding the mixin,
 *   with step, complete and init functions
 */
function _Transformer(reducer, complete, init, step) {
  reducer[transformerStep] = step;
  reducer[transformerCompletion] = complete;
  reducer[transformerInit] = init;
  return reducer;
}

/**
 * @public @function Transformer
 * - the public function that adds the _Transformer mixin for the a given
 *   reducing (step function)
 * - defaults for complete and init functions are provided if omitted
 *
 * @see @interface _Transformer
 *
 * @param {Function} complete (optional)
 * - defaults to calling the identity function
 *
 * @param {Function} init (optional)
 * - defaults to calling the step function with no arguments
 *
 * @returns {_Transformer}
 * - an instance function augmented with the _Transformer mixin
 */
export default (
  reducer,
  complete = identity,
  init = reducer,
  step = reducer
) => _Transformer(reducer, complete, init, step);

/**
 * @public @function step
 * - calls the step function of an instance augmented with the
 *   _Transformer mixin
 *
 * @param {_Transformer} target
 * - an instance augmented with the _Transformer mixin
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
 * - if target is not augmented with the _Transformer mixin
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
 * - an instance augmented with the _Transformer mixin
 *
 * @param {Any} acc
 * - the accumulator passed to the complete function 
 *
 * @returns {Any}
 * - the return value of target's complete function
 *
 * @throws TypeError
 * - if target is not augmented with the _Transformer mixin
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
 * - an instance augmented with the _Transformer mixin
 *
 * @returns {Any}
 * - the return value of target's init function
 *
 * @throws TypeError
 * - if target is not augmented with the _Transformer mixin
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
 * - checks whether target is augmented with the  _Transformer mixin
 *
 * @param {Any} target
 * - the target to check
 *
 * @returns {Boolean}
 * - true if target is augmented with the _Transformer mixin,
 *   false otherwise
 */
export const isTransformer = target =>
  isFunction(target[transformerStep]) &&
  isFunction(target[transformerCompletion]) &&
  isFunction(target[transformerInit]);

