import { isFunction } from "./../../utils/checks";
import { currify } from "./../curry";

export default currify((sg2, sg1) => {
  if (!isFunction(sg1.concat))
    throw new Error(`Semigroup ${sg1} does not have concat method!`);

  else if (!isFunction(sg2.concat))
    throw new Error(`Semigroup ${sg2} does not have concat method!`);

  return sg1.concat(sg2);
});
