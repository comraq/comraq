import { isArray, isUndefined } from "./../../utils/checks";

export default a => {
  if (!isArray(a))
    throw new Error(`Cannot get head element of non-array ${a}!`);

  return (isUndefined(a[0]))? null: a[0];
};
