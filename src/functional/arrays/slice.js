import { currify } from "./../curry";

export default currify(
  (begin, end, target) => target.slice(begin, end)
);
