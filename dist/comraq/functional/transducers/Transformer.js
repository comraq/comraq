"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTransformer = exports.init = exports.complete = exports.step = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _types = require("./../../utils/types");

var _library = require("./../library");

var transformerInit = Symbol.for("transformer-init");
var transformerCompletion = Symbol.for("transformer-completion");
var transformerStep = Symbol.for("transformer-step");

/**
 * @private @mixin _Transformer
 * - augments the original reducing function with the _Transformer mixin,
 *   adding complete, init and step functions for transducers to call
 *
 * @param {Function} reducer
 * - the original reducing function
 *
 * @param {Function} complete
 * - the 1 arity version of the reducing function
 *
 * @see @function complete
 *
 * @param {Function} init
 * - the 0 arity version of the reducing function
 *
 * @see @function init
 *
 * @param {Function} step
 * - the 2+ arity version of the reducing function
 *
 * @see @function step
 *
 * @return {Function}
 * - returns the original function after adding the mixin,
 *   with step, complete and init functions
 */
function _Transformer(reducer, complete, init, step) {
  reducer[transformerStep] = step;
  reducer[transformerCompletion] = complete;
  reducer[transformerInit] = init;
  return reducer;
}

/**
 * @public @function Transformer
 * - the public function that adds the _Transformer mixin for the a given
 *   reducing (step function)
 * - defaults for complete and init functions are provided if omitted
 *
 * @see @interface _Transformer
 *
 * @param {Function} complete (optional)
 * - defaults to calling the identity function
 *
 * @param {Function} init (optional)
 * - defaults to calling the step function with no arguments
 *
 * @returns {_Transformer}
 * - an instance function augmented with the _Transformer mixin
 */

exports.default = function (reducer) {
  var complete = arguments.length <= 1 || arguments[1] === undefined ? _library.identity : arguments[1];
  var init = arguments.length <= 2 || arguments[2] === undefined ? reducer : arguments[2];
  var step = arguments.length <= 3 || arguments[3] === undefined ? reducer : arguments[3];
  return _Transformer(reducer, complete, init, step);
};

/**
 * @public @function step
 * - calls the step function of an instance augmented with the
 *   _Transformer mixin
 *
 * @param {_Transformer} target
 * - an instance augmented with the _Transformer mixin
 *
 * @param {Any} acc
 * - the accumulator passed to the step function
 *
 * @param {Any} next
 * - the next element in the Iterable sequence passed to the step function
 *
 * @param {Any, variadic} ...args
 * - any remaining arguments passed to the step function
 *
 * @returns {Any}
 * - the return value of target's step function
 *
 * @throws TypeError
 * - if target is not augmented with the _Transformer mixin
 */


var step = exports.step = function step(target, acc, next) {
  for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    args[_key - 3] = arguments[_key];
  }

  if (!isTransformer(target)) throw new TypeError(target + " does not implement the Transformer interface");

  return _library.curriedApply.apply(undefined, [target[transformerStep], acc, next].concat(args));
};

/**
 * @public @function complete
 * - calls the complete function of an instance implementing the
 *   _Transformer interface
 *
 * @param {_Transformer} target
 * - an instance augmented with the _Transformer mixin
 *
 * @param {Any} acc
 * - the accumulator passed to the complete function
 *
 * @returns {Any}
 * - the return value of target's complete function
 *
 * @throws TypeError
 * - if target is not augmented with the _Transformer mixin
 */
var complete = exports.complete = function complete(target, acc) {
  if (!isTransformer(target)) throw new TypeError(target + " does not implement the Transformer interface");

  return target[transformerCompletion](acc);
};

/**
 * @public @function init
 * - calls the init function of an instance implementing the
 *   _Transformer interface
 *
 * @param {_Transformer} target
 * - an instance augmented with the _Transformer mixin
 *
 * @returns {Any}
 * - the return value of target's init function
 *
 * @throws TypeError
 * - if target is not augmented with the _Transformer mixin
 */
var init = exports.init = function init(target) {
  if (!isTransformer(target)) throw new TypeError(target + " does not implement the Transformer interface");

  return target[transformerInit]();
};

/**
 * @public @function isTransformer
 * - checks whether target is augmented with the  _Transformer mixin
 *
 * @param {Any} target
 * - the target to check
 *
 * @returns {Boolean}
 * - true if target is augmented with the _Transformer mixin,
 *   false otherwise
 */
var isTransformer = exports.isTransformer = function isTransformer(target) {
  return _typeof(target[transformerStep]) === _types.pFunction && _typeof(target[transformerCompletion]) === _types.pFunction && _typeof(target[transformerInit]) === _types.pFunction;
};