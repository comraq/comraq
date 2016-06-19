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

export { default as transduce, transduce1 } from "./transduce";
export { default as map } from "./map";
export { default as filter } from "./filter";
export { default as take } from "./take";
export { partitionAll } from "./partition";

// TODO
export const into = () => {};
