import { isFunction } from "./../../utils/checks";

import { currify, placeholder } from "./../curry";

/**
 * @public @function join
 * - calls join on a monad if passed as first argument
 * - otherwise, calls sep on monad while passing in an optional separator
 * 
 * @param {Any|Monad} sep
 * - a separator for join, or an monad to be joined
 * 
 * @param {Any|Monad} monad
 * - the monad to be joined with the optional separator
 *
 * @returns {Any}
 * - the joined result of the monad
 *
 * @throws Error
 * - when recieved a non-monad that does not have the method join
 */
const join = currify((sep, monad) => {
  if (isFunction(sep.join)) {
    // Monad is passed in as the first argument!
    return sep.join();

  } else if (monad === undefined)
    return join.bind(this, sep);

  else if (!isFunction(monad.join))
    throw new Error(`Monad ${monad} does not have method join!`);

  return monad.join(sep);
}, 1, false, placeholder);

export default join;
