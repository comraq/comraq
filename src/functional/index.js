import composable from "./composable";
import * as strings from "./strings";
import * as arrays from "./arrays";

import * as iterables from "./iterables";

import { trace } from "./utils";
import { getProp, withProp } from "./prop";
import { default as curry, currify } from "./curry";
import { compose, pipe } from "./composition";

export default {
  composable: composable,
  strings,
  arrays,
  iterables,
  trace,
  getProp, withProp,
  curry, currify,
  compose, pipe
};
