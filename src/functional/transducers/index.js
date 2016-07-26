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
export { default as filter, remove, distinct, dedupe, keep } from "./filter";
export { default as replace } from "./replace";
export { default as take, takeWhile, takeNth } from "./take";
export { default as drop, dropWhile } from "./drop";
export { default as cat } from "./cat";
export { partitionAll, partitionBy } from "./partition";
export { default as random } from "./random";
export { default as interpose } from "./interpose";
export { default as identity } from "./identity";

export { default as tail } from "./tail";
export { default as initial } from "./initial";
export { default as flatmap } from "./flatmap";

/**
 * TODO-list:
 * - mapcat/flatmap
 */

