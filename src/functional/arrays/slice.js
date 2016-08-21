import { curry, placeholder } from "./../library";

/**
 * @public @function slice
 * - composable curried version of Array.prototype.slice
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
 */
export default curry(
  (begin, end, target) => target.slice(begin, end),
  3,
  placeholder
);
