import { types } from "./../../utils";

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
  switch(types.toString(monoid)) {
    case types.sString:
      return "";

    case types.sObject:
      return {};

    default:
      // Defaults to 'types.sArrays'
      return [];
  }
};
