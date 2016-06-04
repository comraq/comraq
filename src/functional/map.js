import { isFunction, isArray } from "../utils/checks";

import compose from "./compose";
import currify from "./currify";

export default (...args) => {
  const last = args[args.length - 1];

  if (!isFunction(last)) {
    if (args.length <= 1)
      throw new Error("`Map cannot be applied without "
        + "first specifying a function!");

    else if (!isArray(last))
      throw new Error(`Map cannot be applied against non-array ${last}!`);

    return Array.prototype.map.call(last, compose(...(args.slice(0, -1))));

  }

  return currify(target => {
    if (!isArray(target))
      throw new Error(`Map cannot be applied against non-array ${target}!`);

    return Array.prototype.map.call(target, compose(...args));
  });
};
