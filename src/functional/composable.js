import { isFunction } from "./../utils/checks";

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
      return selfFunc.apply(null, arguments);
    }

    // Always pass all potential arguments to to-be-called function (selfFunc)
    // Regardless of selfFunc.length
    return (...args) => composable(selfFunc)(next.apply(null, args));
  };
};

export default composable;
