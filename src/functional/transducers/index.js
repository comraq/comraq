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
export { default as take, takeWhile } from "./take";
export { default as concat, concatMutable } from "./concat";
export { partitionAll } from "./partition";

// TODO: init, partitionBy and etc...
