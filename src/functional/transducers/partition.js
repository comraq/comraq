import { isUndefined } from "./../../utils/checks";
import { currify } from "./../curry";
import { concatMutable } from "./../algebraic/concat";
import { length } from "./../strings";

import { step, complete, init, default as Transformer } from "./Transformer";
import { ensureUnreduced } from "./Reduced";

export const partitionAll =  currify((size, transformer) => {
  let count = 0, partition = undefined;

  return Transformer(
    (acc, next, ...args) => {
      partition = (isUndefined(partition))? acc.empty(): partition;

      if (count++ < size)
        partition = concatMutable(partition, next);

      else {
        const temp = partition;
        count = 1;
        partition = concatMutable(acc.empty(), next);
        return step(transformer, acc, temp, ...args);
      }   

      return acc;
    },
    acc => {
      if (length(partition) > 0)
        acc = ensureUnreduced(step(transformer, acc, partition));

      return complete(transformer, acc);
    },

    () => init(transformer)
  );
});
