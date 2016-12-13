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


  // The internal structure which represents the transitions. In general
  // it works like this: this.structure.get(start).get(actionType) = destination.


  // The name of the initial state of the machine. This is the first state
  // given to the constructor.
  function Machine(states) {
    var _this = this;

    var middlewares = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, Machine);

    if (states.length < 1) {
      throw new Error('You need at least one state!');
    }
    this.states = new Map();
    this.structure = new Map();
    this.middlewares = [];
    states.forEach(function (state) {
      if (!_this.initial) _this.initial = state.name;
      _this.states.set(state.name, state);
      _this.structure.set(state.name, new Map());
    });
    this.middlewares = middlewares;
    this.middlewares.reverse();
  }

  // Function that creates a SingleBound to start building a transition.


  // A list of middlewares that wrap around the dispatch function.


  // A map of all the states which maps the names to the states for
  // O(1) lookup.


  // The name of the current state of the machine, null if not started yet.


  _createClass(Machine, [{
    key: 'from',
    value: function from(name) {
      return new _Bounds.SingleBound(this, name);
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
      if (this.structure.has(start) && this.structure.has(end)) {
        var maps = this.structure.get(start);
        if (!maps) {
          var newMap = new Map();
          newMap.set(actionType, end);
          this.structure.set(start, newMap);
        } else {
          maps.set(actionType, end);
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
      var _this2 = this;

      if (this.canDispatch(action)) {
        this.middlewares.reduce(function (d, f) {
          return f(d);
        }, function (act) {
          if (!_this2.current) {
            throw new Error('This machine is not started!');
          }
          var maps = _this2.structure.get(_this2.current);
          if (maps) {
            var destination = maps.get(act.type);
            if (destination) _this2.current = destination;
            if (!destination) throw new Error('No destination found!');
          } else {
            throw new Error('No map found, fatal!');
          }
        })(action);
      }
    }
  }]);

  return Machine;
}();

exports.Machine = Machine;