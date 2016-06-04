import { isFunction } from "../utils/checks";

const curry = (func, ...args) => {
  if (!isFunction(func))
    throw new Error(`First argument '${func}' of curry is not a function!`);

  return func.bind(null, ...args);
};

export default curry;
