import { isFunction } from "../utils/checks";

const currify = selfFunc => {
  if (!isFunction(selfFunc))
    throw new Error(
      `First argument '${selfFunc}' of currify is not a function!`
    );

  return (...args) => {
    const next = args[0];
    if (!isFunction(next)) {
      // First argument is not a function, execute and return result
      return selfFunc.apply(null, args);
    }

    return function() {
      return currify(selfFunc)(next.apply(null, arguments));
    };
  };
};

export default currify;
