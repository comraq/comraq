import { isFunction } from "./../../utils/checks";

/**
 * @private @var {Symbol} functorSymbol
 * - private symbol used when checking with instanceof
 */
const functorSymbol = Symbol.for("comraq-Functor");

export default {
  /**
   * @public @function implement
   * - allows a source object to implement the Functor typeclass
   *
   * @param {Any} source
   * - the source object implementing Functor
   *
   * @param {Object} implementation
   * - an object containing an implementation of fmap where fmap is defined
   *   as a function
   *
   * @return {Any}
   * - the updated source object
   *
   * @throws TypeError
   * - if the implementation object does not have a fmap function
   * - if fmap is later called without a function
   */
  implement: (source, implementation) => {
    if (!isFunction(implementation.fmap))
      throw new TypeError(
        "Cannot implement the Functor Typeclass without 'fmap'!"
      );

    source.fmap = g => {
      if (!isFunction(g))
        throw new TypeError(`Cannot fmap with Non-Function ${g}!`);

      return implementation.fmap(g);
    };

    source[functorSymbol] = true;
    return source;
  },

  /**
   * @public @function
   * - allows Functor instances to be verified via 'instanceof'
   */
  [Symbol.hasInstance]: instance => {
    return instance[functorSymbol] === true;
  },
};
