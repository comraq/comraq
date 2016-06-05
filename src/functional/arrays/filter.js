import { isFunction } from "./../../utils/checks";

import arrayFunction from "./array-function";

/**
 * A filter allowing any number of functions to be passed and composed
 * before a final filter function returning a boolean is called
 */
export default (...args) =>
  arrayFunction("Filter", Array.prototype.filter,
    ...(args.map(arg => {
      /**
       * Add a hook to each function passed to filter, by returning the
       * array elem value if not false, allowing the continuation of
       * function composition before returning boolean to filter
       * 
       * If false, shortcircuit and return false immediately
       *
       * Note: Since, non-filter methods can be passed, check strict
       *       equality with false to avoid entries such as
       *       number 0 type coercing into false
       */
      let result = arg;
      if (isFunction(arg)) {
        result = (e, i, array) => {
          if (e === false)
            return false;

          let value = arg(e, i, array);
          if (value === false)
            return false;

          // If the filter method return boolean true, we pass along 
          // the original element onto the next filter method
          else if (value === true)
            return e || value;

          // Non-boolean filter method, return the transformed value
          return value;
        };
      }

      return result;
    }))
  );
