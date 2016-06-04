import { isFunction } from "../utils/checks";

import { reverse } from "./utils";
import currify from "./currify";

const getResult = (...args) => {
  const target = args[args.length - 1];
  let funcs = args.slice(0, -1);

  return funcs.reduce((result, func) => {
    if (!isFunction(func))
      throw new Error("Compose can only take non-function arguments "
        + "as the last argument!");

    return func(result);
  }, target);
};

export default (...args) => {
  const target = args[args.length - 1];

  if (!isFunction(target)) {
    if (args.length <= 1)
      throw new Error("Functions must be supplied before targets!");

    else
      return getResult(...(reverse(args.slice(0, -1))), target);
  }

  return currify(target => getResult(...(reverse(args)), target));
};

