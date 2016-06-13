import { isFunction } from "./../../utils/checks";
import { currify } from "./../curry";
import reduceL from "./reduce";

/**
 * @function map     
 * - map against a functor, a Monoid or an iterable collection using reduceL
 *
 * @throws non-iterable 
 * - Monoid does not enforce iteration, no need to check for isIterable.
 *   As a result, reduceL might throw non-iterable!
 */
export default currify((func, functor) => {
  if (!isFunction(func))
    throw new Error(
      "map cannot be applied without first specifying a function!"
    );

  else if (isFunction(functor.map))
    return functor.map(func);

  // TODO: Eliminate the below checks after creating a Monoid class
  //       and checking for instanceof Monoid
  if (!isFunction(functor.empty))
    throw new Error(
      "map cannot be applied on a monoid without the empty method!"
    );

  else if (!isFunction(functor.concatMutable))
    throw new Error(
      "map cannot be applied on a monoid without the concatMutable method!"
    );

  return reduceL((acc, next, index, functor) =>
    acc.concatMutable(func(next, index, functor))
  , functor.empty(), functor);
});
