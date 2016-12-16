'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _State = require('./State');

var _Bounds = require('./Bounds');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Represents a state machine that will handle all the internal logic.
var Machine = function () {

  // Creates a new instance of a state machine with the given states and
  // middlewares. The first given state will be the initial state.
  // The list of middlewares will be wrapped around the dispatch function
  // in the order as they are provided. The created machine has no transitions.


  // A map of all the states which maps the names to the states for
  // O(1) lookup.


  // The name of the current state of the machine, null if not started yet.
  function Machine(states) {
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
  }

  // Function that creates a SingleBound to start building a transition.


  // The internal structure which represents the transitions. In general
  // it works like this: this.structure.get(start).get(actionType) = destination.


  // The name of the initial state of the machine. This is the first state
  // given to the constructor.


  _createClass(Machine, [{
    key: 'from',
    value: function from(state) {
      return new _Bounds.SingleBound(this, state);
    }

    // Checks if this machine has the given state (with the same name).

  }, {
    key: 'hasState',
    value: function hasState(state) {
      return this.hasStateName(state.name);
    }

    // Checks if this machine has a state with given name.

  }, {
    key: 'hasStateName',
    value: function hasStateName(name) {
      return this.states.has(name);
    }

    // Initializes the current state to the initial state.

  }, {
    key: 'start',
    value: function start() {
      this.current = this.initial;
    }

    // Sets the current state to null.

  }, {
    key: 'stop',
    value: function stop() {
      this.current = null;
    }

    // Checks if the current state is set.

  }, {
    key: 'isStarted',
    value: function isStarted() {
      return !!this.current;
    }

    // Returns the current state if this machine is started. If not,
    // it returns null.

  }, {
    key: 'getCurrentState',
    value: function getCurrentState() {
      return this.current ? this.states.get(this.current) : null;
    }

    // Creates a transition from the start state to the end state which
    // triggers on the given actionType.

  }, {
    key: 'addTransition',
    value: function addTransition(start, end, actionType) {
      if (this.structure.has(start.name) && this.structure.has(end.name)) {
        var maps = this.structure.get(start.name);
        if (!maps) {
          var newMap = new Map();
          newMap.set(actionType, end.name);
          this.structure.set(start.name, newMap);
        } else {
          maps.set(actionType, end.name);
        }
      } else {
        throw new Error('Invalid transition for machine!');
      }
    }

    // Checks if the machine can dispatch the given action at
    // this moment. This means it is started yet, there is a transition
    // that is triggered by this action that starts from the current
    // state and the action has all the params needed for the destination
    // state.

  }, {
    key: 'canDispatch',
    value: function canDispatch(action) {
      if (this.current && this.structure.has(this.current)) {
        var transitions = this.structure.get(this.current);
        if (transitions && transitions.has(action.type)) {
          var destination = transitions.get(action.type);
          if (destination) {
            var state = this.states.get(destination);
            if (state) {
              return state.validate(action.params);
            }
          }
        }
      }
      return false;
    }

    // Dispatches the given action. If, for some reason, this state
    // machine can not dispatch, it will ignore the input.

  }, {
    key: 'dispatch',
    value: function dispatch(action) {
      if (this.canDispatch(action)) {
        if (!this.current) {
          throw new Error('This machine is not started!');
        }
        var maps = this.structure.get(this.current);
        if (maps) {
          var destination = maps.get(action.type);
          if (destination) this.current = destination;
          if (!destination) throw new Error('No destination found!');
        } else {
          throw new Error('No map found, fatal!');
        }
      }
    }
  }]);

  return Machine;
}();

exports.Machine = Machine;