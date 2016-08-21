export { default as Arrow } from "./Arrow";

export { trace } from "./utils";
export { getProp, withProp, hasProp } from "./prop";
export { compose, pipe } from "./composition";
export { default as nAry } from "./arity";
export { default as flip } from "./flip";
export { default as identity } from "./identity";
export { empty } from "./empty";
export { default as concat, concatMutable } from "./concat";

export {
  default as curry,
  isCurried,
  getArity,
  partial,
  placeholder,
  curriedApply
} from "./curry";
