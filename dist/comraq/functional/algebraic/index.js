"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Monoid = require("./Monoid");

Object.defineProperty(exports, "empty", {
  enumerable: true,
  get: function get() {
    return _Monoid.empty;
  }
});
Object.defineProperty(exports, "concat", {
  enumerable: true,
  get: function get() {
    return _Monoid.concat;
  }
});
Object.defineProperty(exports, "concatMutable", {
  enumerable: true,
  get: function get() {
    return _Monoid.concatMutable;
  }
});

var _join = require("./join");

Object.defineProperty(exports, "join", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_join).default;
  }
});

var _identity = require("./identity");

Object.defineProperty(exports, "identity", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_identity).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }