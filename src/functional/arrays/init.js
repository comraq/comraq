import { isFunction, isArray, isIterable } from "./../../utils/checks";
import { getIterator } from "./../iterables";

export default a => {
  if (!isIterable(a))
    throw new Error(`Cannot get init elements of non-iterable ${a}!`);

  else if (isArray(a))
    return (a.length > 1)? a.slice(0, -1): [];

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
  const acc = a.empty();

  let curr = iterator.next();
  let next = iterator.next();
  while (!next.done) {
    acc.concatMutable(curr.value);
    curr = next;
    next = iterator.next();
  }

  return acc;
};
