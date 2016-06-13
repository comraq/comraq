import { isArray, isIterable, isFunction } from "./../../utils/checks";
import { currify } from "./../curry";
import { getIterator } from "./../iterables";

export default currify((num, a) => {
  if (!isIterable(a))
    throw new Error(`Cannot take elements from non-iterable ${a}!`);

  else if (isArray(a)) {
    num = (num > a.length)? a.length: num;
    return a.slice(0, num);
  }

  // TODO: Eliminate the below checks after creating a Monoid class
  //       and checking for instanceof Monoid
  else if (!isFunction(a.empty))
    throw new Error(
      "tail cannot be applied on a monoid without the empty method!"
    );

  else if (!isFunction(a.concatMutable))
    throw new Error(
      "tail cannot be applied on a monoid without the concatMutable method!"
    );

  const iterator = getIterator(a);
  const result = a.empty();
  let i = 0;
  let item = iterator.next();
  while (i++ < num && !item.done) {
    result.concatMutable(item.value);
    item = iterator.next();
  }

  return result;
});

export const takeWhile = currify((func, a) => {
  if (!isIterable(a))
    throw new Error(`Cannot take elements from non-iterable ${a}!`);

  const iterator = getIterator(a);
  const result = a.empty();
  let item = iterator.next();
  while (func(item.value) && !item.done) {
    result.concatMutable(item.value);
    item = iterator.next();
  }

  return result;
});
