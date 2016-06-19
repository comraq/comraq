import { currify } from "./../curry";
import { step, complete, init, default as Transformer } from "./Transformer";

export default currify((func, transformer) => Transformer(
  (acc, next, ...args) => step(transformer, acc, func(next), ...args),

  acc => complete(transformer, acc),

  () => init(transformer)
));
