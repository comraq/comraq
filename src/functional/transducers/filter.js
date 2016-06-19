import { currify } from "./../curry";
import { step, complete, init, default as Transformer } from "./Transformer";

export default currify((predicate, transformer) => Transformer(
  (acc, next, ...args) => (predicate(next))?
    step(transformer, acc, next, ...args): acc,

  acc => complete(transformer, acc),

  () => init(transformer)
));
