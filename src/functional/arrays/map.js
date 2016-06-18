import { isFunction } from "./../../utils/checks";
import { currify } from "./../curry";
import reduceL from "./reduce";

/**
 * @public @function map
 * - map against a functor, a Monoid or an iterable collection using reduceL
 *
 * @param {Function} func
 * - the mapping function applied against each element in the iterable
 *
 * @param {Any|Iterable|Functor} functor
 * - the target iterable/functor
 *
 * @throws Error
 * - mapping function func is not a function
 *
 * @throws Error
 * - non-monoid without an empty method
 * 
 * @throws Error
 * - non-monoid without a concatMutable(concat) method
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
