import { pFunction } from "./../../utils/types";
import Functor from "./Functor";

/**
 * @private @var {Symbol} applicativeSymbol
 * - private symbol used when checking with instanceof
 */
const applicativeSymbol = Symbol.for("comraq-Applicative");

export default {
  /**
   * @public @function implement
   * - allows a source class to implement the Applicative typeclass
   *
   * @param {Any} source
   * - the source class implementing Applicative
   *
   * @param {Object} implementation
   * - an object containing an implementation of 'of' and 'ap'
   *   where of and fmap are defined as a functions
   *
   * @return {Any}
   * - the updated source class
   *
   * @throws TypeError
   * - if the source class does not implement Functor
   * - if the implementation object does not have an
   *   'of' or 'ap' function
   * - if ap is later called with a different Applicative
   *   class than source
   */
  implement: (source, implementation) => {
    if (!(source instanceof Functor))
      throw new TypeError(
        `${source} must be an instance of Functor before `
        + "implementing Applicative!"
      );

    else if (typeof implementation.ap !== pFunction)
      throw new TypeError(
        "Cannot implement the Applicative Typeclass without 'ap'!"
      );

    else if (typeof implementation.of !== pFunction)
      throw new TypeError(
        "Cannot implement the Applicative Typeclass without 'of'!"
      );

    source.of = implementation.of;
    source.ap = function(a) {
      if (!(a instanceof source))
        throw new TypeError(
          "Cannot ap between Applicatives of different types!"
        );

      return implementation.ap.call(this, a);
    };

    source[applicativeSymbol] = true;
    return source;
  },

  /**
   * @public @function
   * - allows Applicative instances to be verified via 'instanceof'
   */
  [Symbol.hasInstance]: instance => {
    return instance[applicativeSymbol] === true;
  },
};
