import { isInstance } from "./../../utils/checks";

const reducedValue = Symbol.for("reduced-value");
const reducedFlag = Symbol.for("reduced-flag");

/**
 * @private @class _Reduced
 * - a box around a reduced value to short circuit transducers
 *
 * @param {Any} value
 * - the value to box
 */
class _Reduced {
  constructor(value) {
    this[reducedValue] = value;
    this[reducedFlag] = true;
  }
}

/**
 * @public @function Reduced
 * - the public factory for _Reduced
 *
 * @see _Reduced
 */
const Reduced = target => new _Reduced(target);

export default Reduced;

/**
 * @public @function deref
 * - gets the boxed value of a _Reduced instance
 *
 * @param {_Reduced} target
 * - the _Reduced instance
 *
 * @returns {Any}
 * - the yielded boxed value
 */
export const deref = target => target[reducedValue];

/**
 * @public @function isReduced
 * - checks whether a target is an instance of _Reduced
 *
 * @returns {Boolean}
 * - true if target is an instance of _Reduced or the target's
 *   reduced-flag is set, false otherwise
 */
export const isReduced = target =>
  isInstance(_Reduced, target) || target[reducedFlag];

/**
 * @public @function ensureReduced
 * - takes a _Reduced or non-_Reduced instance and ensures
 *   the return of an _Reduced instance wrapping the non-_Reduced value
 * 
 * @param {Any|_Reduced} target
 * - _Reduced or non-_Reduced value to box
 *
 * @returns {_Reduced}
 * - an _Reduced instance with the corrected boxed value
 */
export const ensureReduced = target => {
  if (isReduced(target))
    return target;

  return Reduced(target);
};

/**
 * @public @function ensureUnreduced
 * - takes a _Reduced or non-_Reduced instance and ensures
 *   the return of the unboxed value
 * 
 * @param {Any|_Reduced} target
 * - _Reduced or non-_Reduced value to deref/unbox
 *
 * @returns {Any}
 * - the unboxed value if target is of _Reduced, target otherwise
 */
export const ensureUnreduced = target => {
  if (!isReduced(target))
    return target;

  return deref(target);
};
