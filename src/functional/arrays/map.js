import { isFunction } from "./../../utils/checks";
import { currify } from "./../curry";

export default currify((func, functor) => {
  if (!isFunction(func))
    throw new Error(
      "map cannot be applied without first specifying a function!"
    );

  else if (!isFunction(functor.map))
    throw new Error(
      "map cannot be applied on functor without a map method!"
    );

  return functor.map(func);
});
