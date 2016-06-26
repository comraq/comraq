import { currify, placeholder } from "./../curry";

/**
 * @public @function slice
 * - composable curried version of Array.prototype.slice
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
 */
export default currify(
  (begin, end, target) => target.slice(begin, end),
  3,
  false,
  placeholder
);
