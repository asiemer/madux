'use strict';

var _Store = require('./Store');

var _State = require('./State');

var _Machine = require('./Machine');

exports.createStore = function (machine) {
  var middlewares = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return new _Store.Store(machine, middlewares);
};

exports.createMachine = function (states) {
  return new _Machine.Machine(states);
};

exports.Machine = _Machine.Machine;
exports.State = _State.State;
exports.Store = _Store.Store;