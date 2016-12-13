'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _State = require('./State');

var _Bounds = require('./Bounds');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Machine = function () {
  function Machine(states) {
    var _this = this;

    _classCallCheck(this, Machine);

    if (states.size < 1) {
      throw new Error('You need at least one state!');
    }
    this.states = new Map();
    this.structure = new Map();
    states.forEach(function (state) {
      if (!_this.initial) _this.initial = state.name;
      _this.states.set(state.name, state);
      _this.structure.set(state.name, new Map());
    });
  }

  _createClass(Machine, [{
    key: 'from',
    value: function from(name) {
      return new _Bounds.SingleBound(this, name);
    }
  }, {
    key: 'hasState',
    value: function hasState(state) {
      return this.states.has(state.name);
    }
  }, {
    key: 'hasStateName',
    value: function hasStateName(name) {
      return this.states.has(name);
    }
  }, {
    key: 'start',
    value: function start() {
      this.current = this.initial;
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.current = null;
    }
  }, {
    key: 'isStarted',
    value: function isStarted() {
      return !!this.current;
    }
  }, {
    key: 'addTransition',
    value: function addTransition(start, stop, transition) {
      if (this.structure.has(start) && this.structure.has(stop)) {
        var maps = this.structure.get(start);
        var newMap = new Map();
        newMap.set(transition, stop);
        if (maps) {
          maps.set(transition, stop);
        } else {
          this.structure.set(start, newMap);
        }
      } else {
        throw new Error('Invalid transition for machine!');
      }
    }
  }, {
    key: 'canProcess',
    value: function canProcess(action) {
      return !!action && !!this.current;
    }
  }, {
    key: 'getCurrentState',
    value: function getCurrentState() {
      return this.current ? this.states.get(this.current) : null;
    }
  }, {
    key: 'process',
    value: function process(action) {
      var transition = action.type;
      if (!this.current) {
        throw new Error('This machine is not started!');
      }
      var maps = this.structure.get(this.current);
      if (maps) {
        var destination = maps.get(transition);
        if (destination) this.current = destination;
        if (!destination) throw new Error('No destination found!');
      } else {
        throw new Error('No map found, fatal!');
      }
    }
  }]);

  return Machine;
}();

exports.Machine = Machine;