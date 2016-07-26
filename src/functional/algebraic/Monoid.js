import { types } from "./../../utils";
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
  switch(types.toString(monoid)) {
    case types.sString:
      return "";

    case types.sObject:
      return {};

    default:
      // types.sArrays
      return [];
  }
};

/**
 * @public @function concat
 * - concatenates a value into a semi-group
 *
 * @param {Any|Semigroup} sg
 * - the target being concatenated to
 *
 * @param {Any|Semigroup} value
 * - the target concatenated to sg
 *
 * @returns {Any|Semigroup}
 * - the concatenated target
 *
 * @throws TypeError
 * - if sg is not a valid semigroup,
 *   (does not have the concat method)
 *
 * @throws TypeError
 * - if sg and value are not of the same semigroup
 */
export const concat = currify((sg, value) => {
  let vType = types.toString(value);

  switch(types.toString(sg)) {
    case types.sString:
      if (vType !== types.sString)
        throw new TypeError(
          "Cannot concat a non-string to string!"
        );

      return sg + value;

    case types.sObject:
      if (vType !== types.sObject)
        throw new TypeError(
          "Cannot concat a non-object to object!"
        );

      return Object.assign({}, sg, value);

    case types.sArray:
      if (vType !== types.sArray)
        throw new TypeError(
          "Cannot concat a non-array to array!"
        );

      return sg.concat(value);

    default:
      throw new TypeError(
        `Do not know how to concat for unknown type: ${sg}!`
      );
  }
}, 2, false, placeholder);

/**
 * @private @function concatMutable
 * - mutable version of concat
 *
 * @see @function concat
 */
export const concatMutable = currify((sg, value) => {
  let vType = types.toString(value);

  switch(types.toString(sg)) {
    case types.sString:
      if (vType !== types.sString)
        throw new TypeError(
          "Cannot concatMutable a non-string to string!"
        );

      return sg + value;

    case types.sObject:
      if (vType !== types.sObject)
        throw new TypeError(
          "Cannot concatMutable a non-object to object!"
        );

      return Object.assign(sg, value);

    case types.sArray:
      if (vType !== types.sArray)
        throw new TypeError(
          "Cannot concatMutable a non-array to array!"
        );

      sg.push(...value);
      return sg;

    default:
      throw new TypeError(
        `Do not know how to concatMutable for unknown type: ${sg}!`
      );
  }
}, 2, false, placeholder);
