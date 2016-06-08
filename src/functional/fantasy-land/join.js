import { isFunction } from "./../../utils/checks";

const join = (sep, monad) => {
  if (isFunction(sep.join)) {
    // Monad is passed in as the first argument!
    return sep.join();

  } else if (monad === undefined)
    return join.bind(this, sep);

  else if (!isFunction(monad.join))
    throw new Error(`Monad ${monad} does not have method join!`);

  return monad.join(sep);
};

export default join;
