import { isArray, isUndefined, isIterable } from "./../../utils/checks";
import { getIterator } from "./../iterables";

export default a => {
  if (!isIterable(a))
    throw new Error(`Cannot get head element of non-iterable ${a}!`);

  else if (isArray(a))
    return (isUndefined(a[0]))? null: a[0];

  return getIterator(a).next().value;
};
