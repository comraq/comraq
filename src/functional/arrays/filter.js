import { isFunction } from "./../../utils/checks";
import { currify } from "./../curry";
import reduceL from "./reduce";

/**
 * @function filter     
 * - filters against a Monoid or an iterable collection using reduceL
 *
 * @throws non-iterable 
 * - Monoid does not enforce iteration, no need to check for isIterable.
 *   As a result, reduceL might throw non-iterable!
 */
export default currify((func, monoid) => {
  if (!isFunction(func))
    throw new Error(
      "filter cannot be applied without first specifying a function!"
    );

  else if (isFunction(monoid.filter))
    return monoid.filter(func);

  // TODO: Eliminate the below checks after creating a Monoid class
  //       and checking for instanceof Monoid
  if (!isFunction(monoid.empty))
    throw new Error(
      "filter cannot be applied on a monoid without the empty method!"
    );

  else if (!isFunction(monoid.concatMutable))
    throw new Error(
      "filter cannot be applied on a monoid without the concatMutable method!"
    );

  return reduceL((acc, next, index, monoid) => {
    if (func(next, index, monoid) === false)
      return acc;

    return acc.concatMutable(next);
  }, monoid.empty(), monoid);
});
