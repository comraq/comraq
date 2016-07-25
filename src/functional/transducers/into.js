import { currify, placeholder } from "./../curry";
import { pushMutable } from "./../arrays";
import transduce from "./transduce";

export default currify(
  (acc, transducer, coll) =>
    transduce(transducer, pushMutable, acc, coll),
  3,
  false,
  placeholder
);
