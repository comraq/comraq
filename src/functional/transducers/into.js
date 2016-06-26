import { currify, placeholder } from "./../curry";
import { concatMutable } from "./concat";
import transduce from "./transduce";

export default currify(
  (acc, transducer, coll) =>
    transduce(transducer, concatMutable, acc, coll),
  3,
  false,
  placeholder
);
