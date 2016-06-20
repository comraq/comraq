import { isArray, isIterable, isUndefined } from "./../../utils/checks";
import { getIterator } from "./../iterables";
import { length } from "./../strings";
import { empty } from "./../algebraic";
import { slice } from "./../arrays";

import { concatMutable } from "./concat";
import {
  step, complete, init,
  default as Transformer,
  isTransformer
} from "./Transformer";

/**
 * @public @function initial
 * - gets all except the last element of the iterable
 * 
 * @param {Transformer|Iterable} target
 * - the transformer or target iterable
 *
 * @returns {Transformer|Iterable}
 * - returns transformer if target is an instance with the transformer mixin
 * - an iterable with all but the last element of the iterable
 * - empty iterable if empty target iterable is empty
 */
export default target => {
  if (!isTransformer(target))
    return _initial(target);

  let stored = undefined;
  return Transformer(
    (acc, next, ...args) => {
      if (isUndefined(stored)) {
        stored = [ next, ...args ];
        return acc;
      }

      let prev = stored.splice(0, length(stored), next, ...args) ;
      return step(target, acc, ...prev);
    },

    acc => complete(target, acc),

    () => init(target)
  );
};

/**
 * @private @function _inital
 * - private version of initial that immediately returns the iterable
 *   result when the second argument is not a transformer mixin
 *
 * @see @function initial
 *
 * @throws TypeError
 * - target is not/does not implement the iterable interface
 */
const _initial = target => {
  if (!isIterable(target))
    throw new Error(`Cannot get init elements of non-iterable ${target}!`);

  else if (isArray(target))
    return (length(target) > 1)? slice(0, -1, target): empty(target);

  const iterator = getIterator(target);
  const acc = empty(target);

  let curr = iterator.next();
  let next = iterator.next();
  while (!next.done) {
    concatMutable(curr.value, acc);
    curr = next;
    next = iterator.next();
  }

  return acc;
};
