import { currify, placeholder } from "./../curry";
import map from "./map";
import cat from "./cat";

export default currify((func, target) =>
  map(func, cat(target)), 2, false, placeholder);
