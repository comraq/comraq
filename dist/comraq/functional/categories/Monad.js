"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _symbols = require("./symbols");

var S = _interopRequireWildcard(_symbols);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @public @type @class Monad
 * - a base typeclass/interface for monads
 */
var Monad = function () {
  function Monad() {
    _classCallCheck(this, Monad);
  }

  _createClass(Monad, [{
    key: "construct",
    value: function construct(target) {
      if (target[S.typeConstructor] !== true) throw new TypeError("Cannot declare a Monad instance with non-typeConstructor " + target + "!");

      target[S.monadInstance] = true;
    }
  }, {
    key: "chain",
    value: function chain(f) {
      throw new Error("Monad instances must implement the chain method!");
    }
  }], [{
    key: Symbol.hasInstance,
    value: function value(instance) {
      return instance[S.monadInstance] === true;
    }
  }]);

  return Monad;
}();

exports.default = Monad;