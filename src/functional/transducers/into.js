import { curry, placeholder } from "./../library";
import { pushMutable } from "./../arrays";
import transduce from "./transduce";

export default curry(
  (acc, transducer, coll) =>
    transduce(transducer, pushMutable, acc, coll),
  3,
  placeholder
);
