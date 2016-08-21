import { curry, placeholder } from "./../library";
import map from "./map";
import cat from "./cat";

export default curry((func, target) =>
  map(func, cat(target)), 2, placeholder);
