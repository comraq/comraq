import { isFunction } from "./../../utils/checks";
import { currify } from "./../curry";
import Transformer from "./../transducers/Transformer";

/**
 * @public @function concat
 * - concatenates a value into a semi-group
 *
 * @param {Any|Semigroup} sg1
 * - the target being concatenated to
 *
 * @param {Any|Semigroup} sg2
 * - the target concatenated to sg1
 *
 * @returns {Any|Semigroup}
 * - the concatenated target
 *
 * @throws Error
 * - if sg1 is not a valid semigroup,
 *   (does not have the concat method)
 */
const concat = currify((sg1, sg2) => {
  if (!isFunction(sg1.concat))
    throw new Error(`Semigroup ${sg1} does not have concat method!`);

  return sg1.concat(sg2);
});

export default concat;

export const concatMutable = currify((sg1, sg2) => {
  if (!isFunction(sg1.concatMutable))
    throw new Error(`Semigroup ${sg1} does not have concatMutable method!`);

  return sg1.concatMutable(sg2);
});

export const concatTM = Transformer(concatMutable);
