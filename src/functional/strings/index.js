import { isNumber, isObject } from "./../../utils/checks";
import { currify, placeholder } from "./../curry";

/**
 * @public @function length
 * - gets the length of a string, array, object (number of keys)
 *   or function (function arity)
 *
 * @param {Any} target
 * - the target to retrieve the length
 *
 * @returns {Number}
 * - the length of the target
 *
 * @throws TypeError
 * - non-string, array, object or function
 */
export const length = target => {
  if (isNumber(target.length))
    return target.length;

  else if (isObject(target))
    return target.keys().length;

  throw new TypeError(`Cannot get length of ${target}!`);
};

/**
 * @public @function repeat
 * - composable curried version of String.prototype.repeat
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat
 */
export const repeat = currify(
  (count, s) => s.repeat(count),
  2,
  false,
  placeholder
);

/**
 * @public @function replace
 * - composable curried version of String.prototype.replace
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
 */
export const replace = currify(
  (expr, replacement, s) => s.replace(expr, replacement),
  3,
  false,
  placeholder
);

/**
 * @public @function split
 * - composable curried version of String.prototype.split
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split
 */
export const split = currify((sep, s) => s.split(sep), 2, false, placeholder);

/**
 * @public @function lower
 * - composable curried version of String.prototype.toLowerCase
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase
 */
export const lower = s => s.toLowerCase();

/**
 * @public @function upper
 * - composable curried version of String.prototype.toUpperCase
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase
 */
export const upper = s => s.toUpperCase();

/**
 * @public @function trim
 * - composable curried version of String.prototype.trim
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
 */
export const trim = s => s.trim();
