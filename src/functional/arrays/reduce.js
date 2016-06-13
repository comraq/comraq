import { isFunction, isIterable } from "./../../utils/checks";
import { currify } from "./../curry";
import {
  getIterator,
  reverse as reverseIterable,
  reduce as iterReduce
} from "./../iterables";

export default currify((func, acc, iterable) => {
  if (!isFunction(func))
    throw new Error(
      "reduce1 cannot be applied without first specifying a function!"
    );

  else if (isFunction(iterable.reduce))
    return iterable.reduce(func, acc);

  else if (!isIterable(iterable))
    throw new Error(
      "reduce1 cannot be applied on a non-iterable!"
    );

  return iterReduce(func, acc, iterable);
});

export const reduce1 = currify((func, iterable) => {
  if (!isFunction(func))
    throw new Error(
      "reduce1 cannot be applied without first specifying a function!"
    );

  else if (isFunction(iterable.reduce))
    return iterable.reduce(func);

  else if (!isIterable(iterable))
    throw new Error(
      "reduce1 cannot be applied on a non-iterable!"
    );

  const iterator = getIterator(iterable);
  return iterReduce(func, iterator.next().value, iterable, 1, iterator);
});

export const reduceRight = currify((func, acc, iterable) => {
  if (!isFunction(func))
    throw new Error(
      "reduceRight cannot be applied without first specifying a function!"
    );

  else if (isFunction(iterable.reduceRight))
    return iterable.reduceRight(func, acc);

  else if (!isIterable(iterable))
    throw new Error(
      "reduceRight cannot be applied on a non-iterable!"
    );

  iterable = reverseIterable(iterable);
  return iterReduce(func, acc, iterable);
});

export const reduceRight1 = currify((func, iterable) => {
  if (!isFunction(func))
    throw new Error(
      "reduceRight1 cannot be applied without first specifying a function!"
    );

  else if (isFunction(iterable.reduceRight))
    return iterable.reduceRight(func);

  else if (!isIterable(iterable))
    throw new Error(
      "reduceRight1 cannot be applied on a non-iterable!"
    );

  iterable = reverseIterable(iterable);
  const iterator = getIterator(iterable);

  return iterReduce(func, iterator.next().value, iterable, 1, iterator);
});
