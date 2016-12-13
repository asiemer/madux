'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStoreWithMiddleWare = exports.createStore = undefined;

var _Store = require('./Store');

var _Machine = require('./Machine');

var createStore = exports.createStore = function createStore(machine) {
  return new _Store.Store(machine);
};
var createStoreWithMiddleWare = exports.createStoreWithMiddleWare = function createStoreWithMiddleWare(ma, mi) {
  return new _Store.Store(ma, mi);
};