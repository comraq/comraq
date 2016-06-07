import { isFunction } from "./../../utils/checks";
import { currify } from "./../curry";

export default currify((func, foldable) => {
  if (!isFunction(func))
    throw new Error(
      "reduce cannot be applied without first specifying a function!"
    );

  else if (!isFunction(foldable.reduce))
    throw new Error(
      "reduce cannot be applied on foldable without a reduce method!"
    );

  return foldable.reduce(func);
});

export const reduceRight = currify((func, foldable) => {
  if (!isFunction(func))
    throw new Error(
      "reduceRight cannot be applied without first specifying a function!"
    );

  else if (!isFunction(foldable.reduceRight))
    throw new Error(
      "reduceRight cannot be applied on foldable without a reduce method!"
    );

  return foldable.reduceRight(func);
});
