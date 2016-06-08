import { isArray, isUndefined } from "./../../utils/checks";

export default a => {
  if (!isArray(a))
    throw new Error(`Cannot get last element of non-array ${a}!`);

  return (isUndefined(a[a.length - 1]))? null: a[a.length - 1];
};
