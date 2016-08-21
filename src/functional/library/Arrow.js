import { isFunction } from "./../../utils/checks";
import { Functor, Applicative } from "./../categories";

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
 * @private @class Arrow
 * - the Arrow class, 'wrapping' regular functions
 *
 * @implements Functor
 */
const Arrow = {
  [arrowSymbol]: true
};

/**
 * @private @function _pure
 * - helper function for copy a function into an Arrow instance
 *
 * @param {Function} f
 * - the function to lift
 *
 * @return {Function, Arrow}
 * - the original function f with properties and symbols from Arrow
 *   set directly onto the function
 * - as to avoid mutating Function.prototype, duck typing as Arrow
 */
const _pure = f => {
  for (const prop in Arrow)
    f[prop] = Arrow[prop];

  for (const symbol of Object.getOwnPropertySymbols(Arrow))
    f[symbol] = Arrow[symbol];

  f.__func = f;
  return f;
};

/**
 * @public @function of
 * - lifts any value into an Arrow that will return the original value
 *   when called (the called arguments are ignored)
 *
 * @param {Any} x
 * - the value that will be returned when Arrow "function" is called
 *
 * @see @private @function _pure
 */
const of = x => _pure(() => x);


/**
 * Implementations of Typeclasses
 */
Functor.implement(Arrow, {
  fmap: function(g) {
    const f = _compose(g, this.__func)
    return _pure(f);
  }
});

Applicative.implement(Arrow, {
  of: of,
  ap: function(g) {
    return g.fmap(this.__func);
  }
});




/**
 * Define Exposed API in the Object Literal Below
 */
export default {
  of: of,

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
   * @see @private @function _pure
   *
   * @throws TypeError
   * - if func is not a function
   */
  lift: func => {
    if (!isFunction(func))
      throw new TypeError(
        `Non-Function '${func}' cannot be made into Arrow using 'lift'!`
      );

    return _pure((...args) => func(...args));
  }
};
