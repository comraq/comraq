import { isFunction } from "./../../utils/checks";
import { currify } from "./../curry";

/**
 * @public @function empty
 * - gets the empty/void/unit value of a monoid
 *
 * @param {Any|Monoid} monoid
 * - the monoid instance to retrieve unit from
 *
 * @returns {Any|Monoid}
 * - the empty/unit value
 *
 * @throws TypeError
 * - if monoid is not a valid monoid instance,
 *   (does not have the empty method)
 */
export const empty = monoid => {
  if (!isFunction(monoid.empty))
    throw new TypeError(
      `Cannot get empty/unit value of ${monoid} without the empty method!`
    );

  return monoid.empty();
};

/**
 * @public @function concat
 * - concatenates a value into a semi-group
 *
 * @param {Any|Semigroup} sg
 * - the target being concatenated to
 *
 * @param {Any|Semigroup} value
 * - the target concatenated to sg1
 *
 * @returns {Any|Semigroup}
 * - the concatenated target
 *
 * @throws TypeError
 * - if sg is not a valid semigroup,
 *   (does not have the concat method)
 */
export const concat = currify((sg, value) => {
  if (!isFunction(sg.concat))
    throw new TypeError(`Semigroup ${sg} does not have concat method!`);

  return sg.concat(value);
});

/**
 * @public @function concatMutable
 * - mutable version of concat
 * 
 * @see @function concat
 *
 * @throws TypeError
 * - if sg is not a valid semigroup,
 *   (does not have the concatMutable method)
 */
export const concatMutable = currify((sg, value) => {
  if (!isFunction(sg.concatMutable))
    throw new TypeError(`Semigroup ${sg} does not have concatMutable method!`);

  return sg.concatMutable(value);
});
