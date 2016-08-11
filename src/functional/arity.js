import { isFunction } from "./../utils/checks";
import { currify, placeholder } from "./curry";

export default currify((n, func) => {
  if (n < 0)
    throw new TypeError(
      `nAry cannot fix the arity given a non natural number: ${n}!`
    );

  if (!isFunction(func))
    throw new TypeError(
      `nAry cannot fix the arity of non-function ${func}!`
    );

  if (n === 0)
    return () => func();

  return currify(
    (...args) => func(...(args.slice(0, n))),
    n, false, placeholder
  );
}, 2, false, placeholder);
