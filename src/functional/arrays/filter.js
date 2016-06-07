import { isFunction } from "./../../utils/checks";
import { currify } from "./../curry";

export default currify((func, target) => {
  if (!isFunction(func))
    throw new Error(
      "filter cannot be applied without first specifying a function!"
    );

  else if (!isFunction(target.filter))
    throw new Error(
      "filter cannot be applied on target without a filter method!"
    );

  return target.filter(func);
});
