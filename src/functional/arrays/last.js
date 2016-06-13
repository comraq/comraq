import { isArray, isUndefined, isIterable } from "./../../utils/checks";

export default a => {
  if (!isIterable(a))
    throw new Error(`Cannot get last element of non-iterable ${a}!`);

  else if (isArray(a))
    return (isUndefined(a[a.length - 1]))? null: a[a.length - 1];

  for (var item of a) {}
  return item;
};
