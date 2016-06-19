import { currify } from "./../curry";
import { step, complete, init, default as Transformer } from "./Transformer";
import { ensureReduced } from "./Reduced";

export default currify((total, transformer) => {
  let count = 0;

  return Transformer(
    (acc, next, ...args) => {
      if (++count < total)
        return step(transformer, acc, next, ...args);

      else if (count === total)
        return ensureReduced(step(transformer, acc, next, ...args));

      return ensureReduced(acc);
    },
    acc => complete(transformer, acc),

    () => init(transformer)
  );
});
