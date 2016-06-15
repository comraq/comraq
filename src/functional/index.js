import composable from "./composable";
import strings from "./strings";
import arrays from "./arrays";

import * as iterables from "./iterables";

import { trace } from "./utils";
import { getProp, withProp } from "./prop";
import { default as curry, currify } from "./curry";
import { compose, pipe } from "./composition";

const functional = {
  composable,
  strings,
  arrays,
  iterables,
  trace,
  getProp, withProp,
  curry, currify,
  compose, pipe
};

export default functional;
