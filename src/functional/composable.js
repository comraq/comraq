import { isFunction } from "./../utils/checks";

/**
 * @public @function composable
 * - auto wraps a function to only execute if passed in a non-function
 *   as argument
 *
 * @param {Function} selfFunc
 * - the function to be auto-wrapped
 *
 * @returns {Function}
 * - the same function passed in but will non execute but continuously
 *   compose with further functions passed in, without explicitly calling
 *   compose or pipe
 *
 * @throws Error
 * - non-function passed as first argument
 */
const composable = selfFunc => {
  if (!isFunction(selfFunc))
    throw new Error(
      `First argument '${selfFunc}' of currify is not a function!`
    );

  return function() {
    const next = arguments[0];

    if (!isFunction(next)) {
      // First argument is not a function, execute and return result

      // Always pass all potential arguments to to-be-called function (selfFunc)
      // Regardless of selfFunc.length
      return selfFunc.apply(this, arguments);
    }

    // Always pass all potential arguments to to-be-called function (selfFunc)
    // Regardless of selfFunc.length
    return (...args) => composable(selfFunc)(next.apply(this, args));
  };
};

export default composable;
