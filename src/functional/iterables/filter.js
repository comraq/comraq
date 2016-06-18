import { isFunction } from "./../../utils/checks";
import { currify } from "./../curry";
import reduce from "./reduce";

/**
 * @public @function filter
 * - filter against a functor, a Monoid or an iterable collection
 *   by applying a predicate against all elements using reduce
 *
 * @param {Function} predicate
 * - the predicate function applied against each element in the iterable
 *
 * @param {Any|Iterable|Functor} functor
 * - the target iterable/functor
 *
 * @throws Error
 * - predicate is not a function
 *
 * @throws Error
 * - non-monoid without an empty method
 * 
 * @throws Error
 * - non-monoid without a concatMutable(concat) method
 */
export default currify((predicate, monoid) => {
  if (!isFunction(predicate))
    throw new Error(
      "filter cannot be applied without first specifying a function!"
    );

  else if (isFunction(monoid.filter))
    return monoid.filter(predicate);

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

  return reduce((acc, next, index, monoid) => {
    if (predicate(next, index, monoid) === false)
      return acc;

    return acc.concatMutable(next);
  }, monoid.empty(), monoid);
});
