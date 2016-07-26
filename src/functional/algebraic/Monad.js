import * as S from "./symbols";

/**
 * @public @type @class Monad
 * - a base typeclass/interface for monads
 */
export default class Monad {
  construct(target) {
    if (target[S.typeConstructor] !== true)
      throw new TypeError(
        `Cannot declare a Monad instance with non-typeConstructor ${target}!`
      );

    target[S.monadInstance] = true;
  }

  static [Symbol.hasInstance](instance) {
    return instance[S.monadInstance] === true;
  }

  chain(f) {
    throw new Error(
      "Monad instances must implement the chain method!"
    );
  }
}
