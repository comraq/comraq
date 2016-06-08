import { isArray } from "./../../utils/checks";
import { currify } from "./../curry";

export default currify((num, a) => {
  if (!isArray(a))
    throw new Error(`Cannot take elements from non-array ${a}!`);

  num = (num > a.length)? a.length: num;
  return a.slice(0, num);
});

export const takeWhile = currify((func, a) => {
  if (!isArray(a))
    throw new Error(`Cannot take elements from non-array ${a}!`);

  for (var i = 0; i < a.length; ++i) {
    if (!func(a[i]))
      break;
  }

  return a.slice(0, i);
});
