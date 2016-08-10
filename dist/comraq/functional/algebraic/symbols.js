"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Symbols used to mark and act as flags for various
 * type classes and constructors
 */

var functorInstance = exports.functorInstance = Symbol.for("functor-instance");
var applicativeInstance = exports.applicativeInstance = Symbol.for("applicative-instance");
var monadInstance = exports.monadInstance = Symbol.for("monad-instance");

var typeConstructor = exports.typeConstructor = Symbol.for("type-constructor");
var dataConstructor = exports.dataConstructor = Symbol.for("data-constructor");