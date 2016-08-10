"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slice = require("./slice");

Object.defineProperty(exports, "slice", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_slice).default;
  }
});

var _push = require("./push");

Object.defineProperty(exports, "push", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_push).default;
  }
});
Object.defineProperty(exports, "pushMutable", {
  enumerable: true,
  get: function get() {
    return _push.pushMutable;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }