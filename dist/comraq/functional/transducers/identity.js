"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Transformer = require("./Transformer");

var _Transformer2 = _interopRequireDefault(_Transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @public @function identity
 * - transducer version of the identity function
 *
 * @param {Transformer} target
 * - the target instance with the Transformer mixin
 *
 * @return {Transformer}
 * - the id transformer that will call target as the next transformer
 *   accordingly
 *
 * @throws TypeError
 * - if target is not an instance with the Transformer mixin
 */
exports.default = function (target) {
  if (!(0, _Transformer.isTransformer)(target)) throw new TypeError("Non-transformer " + target + " is supplied to identity Transducer!");

  return (0, _Transformer2.default)(function (acc, next) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return _Transformer.step.apply(undefined, [target, acc, next].concat(args));
  }, function (acc) {
    return (0, _Transformer.complete)(target, acc);
  }, function () {
    return (0, _Transformer.init)(target);
  });
};