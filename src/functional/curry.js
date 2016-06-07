import { isFunction } from "../utils/checks";

export const curry = (func, ...args) => {
  if (!isFunction(func))
    throw new Error(`First argument '${func}' of curry is not a function!`);

  return func.bind(null, ...args);
};

export const currify = func => {
  if (!isFunction(func))
    throw new Error(`Argument '${func}' of currify is not a function!`);

  if (func.length === 0)
    return func();
  
  return (...args) => currify(func.bind(null, ...args));
};
