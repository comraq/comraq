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

export { default as into } from "./into";
export { default as transduce, transduce1 } from "./transduce";
export { default as map } from "./map";
export { default as filter } from "./filter";
export { default as take, takeWhile } from "./take";
export { default as concat, concatMutable } from "./concat";
export { partitionAll, partitionBy } from "./partition";

export { default as tail } from "./tail";
export { default as initial } from "./initial";

/**
 * TODO-list:
 * - cat,
 *   mapcat,
 *   remove,
 *   take-nth,
 *   drop,
 *   drop-while,
 *   replace,
 *   partition-by,
 *   keep,
 *   keep-indexed,
 *   map-indexed,
 *   distinct,
 *   interpose,
 *   dedupe,
 *   random-sample
 */
