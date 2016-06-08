import { isArray } from "./../../utils/checks";

export default a => {
  if (!isArray(a))
    throw new Error(`Cannot get tail elements of non-array ${a}!`);

  return (a.length > 1)? a.slice(1): [];
};
