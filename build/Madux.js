'use strict';

var _Store = require('./Store');

var _State = require('./State');

var _Machine = require('./Machine');

exports.createStore = function (machine) {
  return new _Store.Store(machine);
};

exports.State = _State.State;