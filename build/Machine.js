'use strict';

var _State = require('./State');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Machine = function Machine(states) {
  var _this = this;

  _classCallCheck(this, Machine);

  if (states.length < 1) {
    throw new Error('You need at least one state!');
  }
  this.states = new Map();
  this.structure = new Map();
  states.forEach(function (state) {
    if (!_this.initial) _this.initial = state.name;
    _this.states.set(state.name, state);
    _this.structure.set(state.name, new Map());
  });
};

exports.Machine = Machine;