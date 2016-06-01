import { isFunction } from "../utils/checks";

const currify = func => {
  if (!isFunction(func))
    throw new Error(`First argument ${func} of currify is not a function!`);

  return function() {
    const next = arguments[0];
    if (!isFunction(next)) {
      // First argument is not a function, execute and return result
      return func.apply(null, arguments);
    }

    return function() {
      return func(next.apply(null, arguments));
    };
  };
};

export default currify;
//    let args = Array.prototype.slice.call(arguments);
