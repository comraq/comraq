"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trace = undefined;

var _curry = require("./curry");

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
var trace = exports.trace = (0, _curry.currify)(function (msg, data) {
  console.log(msg + ":\nData: " + data);
  return data;
});