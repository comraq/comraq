import { autoCurry } from "./../curry";
import { concatMutable } from "./concat";
import transduce from "./transduce";

export default autoCurry(acc => transducer => coll =>
  transduce(transducer, concatMutable, acc, coll)
);
