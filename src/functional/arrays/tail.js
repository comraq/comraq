import { isArray, isIterable, isFunction } from "./../../utils/checks";
import { getIterator, reduce as iterReduce } from "./../iterables";

export default a => {
  if (!isIterable(a))
    throw new Error(`Cannot get tail elements of non-iterable ${a}!`);

  else if (isArray(a))
    return (a.length > 1)? a.slice(1): [];

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
  iterator.next();
  return iterReduce(
    (acc, next) => acc.concatMutable(next),
    a.empty(),
    a,
    iterator
  );
};
