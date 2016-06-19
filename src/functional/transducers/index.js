/**
 * All of the implementation below are inspired by Clojure's Transducers
 *
 * @link http://clojure.org/reference/transducers
 */

export {
  default as Transformer, 
  step, complete, init,
  isTransformer
} from "./Transformer";

export {
  default as Reduced, 
  deref, isReduced,
  ensureReduced, ensureUnreduced
} from "./Reduced";

// TODO
export const transduce = () => {};

// TODO
export const into = () => {};
