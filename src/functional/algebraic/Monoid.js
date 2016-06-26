import { isFunction } from "./../../utils/checks";
import { currify, placeholder } from "./../curry";

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
 * @private @function _concat
 * - concatenates a value into a semi-group
 * - for public usage, see transducers/concat
 *
 * @see @function transducers/concat
 *
 * @param {Any|Semigroup} value
 * - the target concatenated to sg
 *
 * @param {Any|Semigroup} sg
 * - the target being concatenated to
 *
 * @returns {Any|Semigroup}
 * - the concatenated target
 *
 * @throws TypeError
 * - if sg is not a valid semigroup,
 *   (does not have the concat method)
 */
export const _concat = currify((value, sg) => {
  if (!isFunction(sg.concat))
    throw new TypeError(`Semigroup ${sg} does not have concat method!`);

  return sg.concat(value);
}, 2, false, placeholder);

/**
 * @private @function _concatMutable
 * - mutable version of concat
 * - for public usage, see transducers/concatMutable
 *
 * @see @function concat
 * @see @function transducers/concatMutable
 *
 * @throws TypeError
 * - if sg is not a valid semigroup,
 *   (does not have the concatMutable method)
 */
export const _concatMutable = currify((value, sg) => {
  if (!isFunction(sg.concatMutable))
    throw new TypeError(`Semigroup ${sg} does not have concatMutable method!`);

  return sg.concatMutable(value);
}, 2, false, placeholder);
