'use strict';

var _Store = require('./Store');

var _State = require('./State');

var _Machine = require('./Machine');

exports.createStore = function (machine) {
  return new _Store.Store(machine);
};

exports.createMachine = function (states) {
  var middlewares = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return new _Machine.Machine(states, middlewares);
};

exports.Machine = _Machine.Machine;
exports.State = _State.State;
exports.Store = _Store.Store;