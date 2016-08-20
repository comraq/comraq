import { Transformer } from "./../transducers";
import { identity } from "./../library";
import { isArray } from "./../../utils/checks";

/**
 * @private @function _push
 * - point free non-mutating version of Array.prototype.push
 *
 * @param {Any} value
 * - the target value to push onto the end of the array
 *
 * @param {Array} array
 * - the target array to push to
 *
 * @returns {Array}
 * - the new array with value pushed onto the end
 *
 * @throws TypeError
 * - if array is not of array type
 *
 * @link - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
 */
const _push = (value, array) => {
  if (!isArray(array))
    throw new TypeError(
      `Cannot call push on non-array ${array}!`
    );

  return [ ...array, value ];
};

/**
 * @public @function push
 * - the transformer version of _push with acc and next arguments reversed
 *   for the transformer step version of the function
 *
 * @returns {Transfomer}
 * - _push augmented with the Transformer mixin
 *
 * @see @mixin Transformer
 * @see @function _push
 */
export default Transformer(
  _push,
  identity,
  _push,
  (acc, next) => _push(next, acc)
);

/**
 * @private @function _pushMutable
 * - point free mutating version of Array.prototype.push
 *
 * @param {Any} value
 * - the target value to push onto the end of the array
 *
 * @param {Array} array
 * - the target array to push to
 *
 * @returns {Array}
 * - the new array with value pushed onto the end
 *
 * @throws TypeError
 * - if array is not of array type
 *
 * @link - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
 */
const _pushMutable = (value, array) => {
  if (!isArray(array))
    throw new TypeError(
      `Cannot call pushMutable on non-array ${array}!`
    );

  array.push(value);
  return array;
};

/**
 * @public @function pushMutable
 * - the transformer version of _pushMutable with acc and next arguments
 *   reversed for the transformer step version of the function
 *
 * @returns {Transfomer}
 * - _push augmented with the Transformer mixin
 *
 * @see @mixin Transformer
 * @see @function _pushMutable
 */
export const pushMutable = Transformer(
  _pushMutable,
  identity,
  _pushMutable,
  (acc, next) => _pushMutable(next, acc)
);
