'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Store = require('./Store');

var _Machine = require('./Machine');

// Creates a new store.
exports.default = function (machine) {
  return new _Store.Store(machine);
};