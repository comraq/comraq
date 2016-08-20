import { isFunction } from "./../../utils/checks";
import { Functor } from "./../categories";

/**
 * @private @var {Symbol} arrowSymbol
 * - private symbol used when checking with instanceof
 */
const arrowSymbol = Symbol.for("comraq-Arrow");

/**
 * @private @function _compose
 * - helper function to compose two functions together
 */
const _compose = (g, f) => (...args) => g(f(...args));

/**
 * @private @function _makeArrow
 * - helper function for lifting a function into an Arrow instance
 * - also implements:
 *   - Functor
 *
 * @param {Function} f
 * - the function to lift
 *
 * @return {Arrow}
 * - the original function f lifted into an Arrow instance
 */
const _makeArrow = f => {
  f[arrowSymbol] = true;

  f = Functor.implement(f, {
    fmap: g => _makeArrow(_compose(g, f))
  });

  return f;
};

/**
 * Define Exposed API in the Object Literal Below
 */
const Arrow = {
  /**
   * @public @function of
   * - lifts any value into an Arrow that will return the original value
   *   when called (the called arguments are ignored)
   *
   * @see @private @function _makeArrow
   */
  of: x => _makeArrow(() => x),

  /**
   * @public @function
   * - allows Arrow instances to be verified via 'instanceof'
   */
  [Symbol.hasInstance]: instance => {
    return instance[arrowSymbol] === true;
  },

  /**
   * @public @function lift
   * - lifts a regular function into an Arrow instance
   * - TODO: Verify is curried, to allow for 'ap'
   *
   * @param {Function} func
   * - the function to lift
   *
   * @see @private @function _makeArrow
   *
   * @throws TypeError
   * - if func is not a function
   */
  lift: func => {
    if (!isFunction(func))
      throw new TypeError(
        `Non-Function '${func}' cannot be made into Arrow using 'lift'!`
      );

    return _makeArrow((...args) => func(...args));
  }
};

export default Arrow;
