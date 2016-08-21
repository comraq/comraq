import { default as curry, placeholder } from "./curry";

/**
 * @public @function trace
 * - pipe/composable function to log incoming data and pass them through,
 *   providing the option of adding a custom tag/msg with the data
 *
 * @param {String} msg
 * - the custom msg/tag to identify the data
 *
 * @param {Any} data
 * - the incoming data from the composition/pipe of functions
 *
 * @returns {Any}
 * - returns/passes the incoming data to the next function in the pipeline
 */
export const trace = curry((msg, data) => {
  console.log(`${msg}:\nData: ${data}`);
  return data;
}, 2, placeholder);
