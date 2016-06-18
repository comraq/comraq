import { isFunction } from "./../../utils/checks";
import { currify } from "./../curry";

/**
 * @public @function concat
 * - concatenates 2 semi-groups
 *
 * @param {Any|Semigroup} sg2
 * - the target concatenated to sg1
 *
 * @param {Any|Semigroup} sg1
 * - the target being concatenated to
 *
 * @returns {Any|Semigroup}
 * - the concatenated target
 *
 * @throws Error
 * - if either sg2 or sg1 are not a valid semigroup,
 *   (does not have the concat method)
 */
export default currify((sg2, sg1) => {
  if (!isFunction(sg1.concat))
    throw new Error(`Semigroup ${sg1} does not have concat method!`);

  else if (!isFunction(sg2.concat))
    throw new Error(`Semigroup ${sg2} does not have concat method!`);

  return sg1.concat(sg2);
});
