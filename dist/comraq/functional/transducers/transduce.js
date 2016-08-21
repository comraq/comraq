"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._applyTransform = exports.transduce1 = undefined;

var _library = require("./../library");

var _Transformer = require("./Transformer");

var _iterables = require("./../iterables");

/**
 * @public @function transduce
 * - calls transduce on a transducer, transformer given an initial value on
 *   a target collection
 *
 * @param {Function} transducer
 * - the composed transducer function with all transforms
 *
 * @param {Function|_Transformer} transformer
 * - the reducing transformer function
 *
 * @see @interface _Transformer
 *
 * @param {Any} init
 * - the inital value to be passed to reduce
 *
 * @param {Iterable} target
 * - the iterable target/collection
 *
 * @returns {Any}
 * - the accumulated result of the transduction process
 *
 * @throws TypeError
 * - if transformer does not implement the _Transformer interface
 */
var transduce = (0, _library.curry)(function (transducer, transformer, init, target) {
  if (!(0, _Transformer.isTransformer)(transformer)) throw new TypeError("transduce cannot be applied with non-Transformer " + transformer + "!");

  return (0, _iterables.reduce)(_applyTransform(transducer, transformer), init, target);
}, 4, _library.placeholder);

exports.default = transduce;

/**
 * @public @function transduce1
 * - alternate version of transduce without requiring the init value
 * - the init value is the result of a call to the init function of the
 *   transformer
 *
 * @see @function transduce
 */

var transduce1 = exports.transduce1 = (0, _library.curry)(function (transducer, transformer, target) {
  return transduce(transducer, transformer, (0, _Transformer.init)(transformer), target);
}, 3, _library.placeholder);

/**
 * @private @function _applyTransform
 * - to be shared/used with other internal functions only!
 * - supplies the transformer into the transducer, producing a transformer
 *
 * @param {Function} transducer
 * - the target transducer
 *
 * @param {Function|_Transformer} transformer
 * - the target transfomer
 *
 * @returns {_Transformer}
 * - the resulting instance implementing the _Transformer interface
 *
 * @see @interface _Transformer
 *
 * @throws TypeError
 * - if the result does not implement the _Transformer interface
 */
var _applyTransform = exports._applyTransform = function _applyTransform(transducer, transformer) {
  var result = transducer(transformer);
  if (!(0, _Transformer.isTransformer)(result)) throw new TypeError("Invalid transducer! " + (transducer + " applied with transformer did not return a transformer!"));

  return result;
};