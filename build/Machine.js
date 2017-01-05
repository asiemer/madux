'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMachine = exports.Machine = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Store = require('./Store');

var _Connector = require('./Connector');

var _Binders = require('./Binders');

var _Utils = require('./Utils');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Machine class which represents the internal state machine.
 * @author  Jensen Bernard
 */
var Machine = exports.Machine = function () {
  function Machine() {
    _classCallCheck(this, Machine);

    for (var _len = arguments.length, states = Array(_len), _key = 0; _key < _len; _key++) {
      states[_key] = arguments[_key];
    }

    if (states.length >= 1 && (0, _Utils.areValidStates)(states)) {
      this.initial = states[0].name;
      this.props = [];
      this.states = states.reduce(function (map, state) {
        return map.set(state.name, (0, _Connector.createConnector)(state));
      }, new Map());
    } else if (states.length < 1) {
      throw new Error('expected at least one state: ' + states.length + ' given');
    } else {
      throw new Error('expected valid states, but arguments are invalid');
    }
  }

  _createClass(Machine, [{
    key: 'stop',
    value: function stop() {
      this.current = null;
    }
  }, {
    key: 'start',
    value: function start() {
      this.current = this.initial;
    }
  }, {
    key: 'isStarted',
    value: function isStarted() {
      return !!this.current;
    }
  }, {
    key: 'getProps',
    value: function getProps() {
      return this.props.reduce(function (obj, opt) {
        return Object.assign({}, obj, _defineProperty({}, opt.name, opt.value));
      }, {});
    }
  }, {
    key: 'getPropsToMerge',
    value: function getPropsToMerge() {
      return this.props.filter(function (opt) {
        return opt.merge;
      }).reduce(function (obj, opt) {
        return Object.assign({}, obj, _defineProperty({}, opt.name, opt.value));
      }, {});
    }
  }, {
    key: 'getMergedProps',
    value: function getMergedProps(action) {
      return Object.assign({}, this.getPropsToMerge(), action.params);
    }
  }, {
    key: 'updateActionParameters',
    value: function updateActionParameters(action) {
      return {
        type: action.type,
        params: this.getMergedProps(action)
      };
    }
  }, {
    key: 'parseOptionsForCurrentState',
    value: function parseOptionsForCurrentState(options) {
      var state = this.getCurrentState();
      if (!state || !state.props) {
        return [];
      }
      return state.props.map(function (prop) {
        return {
          name: prop.name,
          merge: prop.merge,
          value: options[prop.name]
        };
      });
    }
  }, {
    key: 'getCurrentState',
    value: function getCurrentState() {
      var connector = this.current ? this.states.get(this.current) : null;
      return connector ? connector.state : null;
    }
  }, {
    key: 'lock',
    value: function lock() {
      this.locked = true;
    }
  }, {
    key: 'unlock',
    value: function unlock() {
      this.locked = false;
    }
  }, {
    key: 'isLocked',
    value: function isLocked() {
      return !!this.locked;
    }
  }, {
    key: 'hasStateName',
    value: function hasStateName(name) {
      return this.states.has(name);
    }
  }, {
    key: 'hasState',
    value: function hasState(state) {
      if (!state) return false;
      var connector = this.states.get(state.name);
      return (0, _Utils.isValidState)(state) && !!connector && JSON.stringify(connector.state) === JSON.stringify(state);
    }
  }, {
    key: 'from',
    value: function from(state) {
      return (0, _Binders.createSingleBinder)(this, state);
    }

    /**
     * Adds a transition from the given state to the given end state that triggers on the given
     * actionType. Both start and end state should be in this machine. This can only be done when
     * the machine is not locked!
     * @param {State} start - The start state of the transition.
     * @param {string} actionType - The actionType that should trigger the action.
     * @param {State} end - The end state of the transition.
     * @throws {Error} - If and only if the states are invalid, !actionType, the states are not
     *                   available to the machine or the machine is locked.
     */

  }, {
    key: 'addTransition',
    value: function addTransition(start, actionType, end) {
      if (this.isLocked()) {
        throw new Error('this machine is locked');
      }
      if ((0, _Utils.isValidState)(start) && (0, _Utils.isValidState)(end) && actionType && typeof actionType === 'string') {
        var connectorA = this.states.get(start.name);
        var connectorB = this.states.get(end.name);
        if (connectorA && connectorB && connectorA.state === start && connectorB.state === end) {
          connectorA.addTransitionForwards(actionType, end.name);
          connectorB.addTransitionBackwards(actionType, start.name);
        } else {
          throw new Error('states not in this machine: ' + start.name + ' - ' + end.name);
        }
      } else {
        throw new Error('invalid states for transition: ' + start.name + ' - ' + end.name);
      }
    }

    /**
     * Returns whether or not this machine can process the given action at the moment. This is based
     * on whether or not there is a transition leaving from the current state with the given
     * action.type and also the action has all the required properties for the destination state.
     * @param {Action} action - The action that should be checked.
     * @return {boolean} - Whether or not the given action can be processed.
     */

  }, {
    key: 'canProcess',
    value: function canProcess(plain) {
      try {
        this.crashForInvalidAction(plain);
        return true;
      } catch (exc) {
        return false;
      }
    }

    /**
     * Does exactly van canProcess does, except it does not return a value but throws an error with
     * description if the machine can't process the action.
     */

  }, {
    key: 'crashForInvalidAction',
    value: function crashForInvalidAction(plain) {
      if (!plain) throw new Error('action may not be null or undefined');
      if (!(0, _Utils.isValidAction)(plain)) throw new Error('action does not have valid structure');
      var action = this.updateActionParameters(plain);
      if (!this.current) throw new Error('this machine has no current state');
      var connector = this.states.get(this.current);
      if (!connector) throw new Error('this machine has no current state-connector');
      var name = connector.getDestinationStateName(action.type);
      if (!name) throw new Error('no transition found for type ' + action.type);
      var dest = this.states.get(name);
      if (!dest) throw new Error('destination state ' + name + ' not in this machine');
      if (!(0, _Utils.isValidActionForState)(action, dest.state)) {
        throw new Error('parameters not correctly instanciated: ' + JSON.stringify(action));
      }
    }

    /**
     * Processes the given action when it can be processed (see canProcess(action: Action)).
     * @param {Action} - The action that will be processed.
     * @throws {Error} - If and only if the destination is not found or the action can't be processed.
     */

  }, {
    key: 'process',
    value: function process(raw) {
      var action = this.updateActionParameters(raw);
      if (!this.canProcess(action)) {
        throw new Error('this action can not be processed');
      }
      if (!this.isLocked()) {
        throw new Error('this machine should be locked');
      }
      var connectorA = this.current ? this.states.get(this.current) : null;
      var dest = connectorA ? connectorA.getDestinationStateName(action.type) : null;
      if (!dest) {
        throw new Error('something went wrong, no dest found');
      }
      this.current = dest;
      this.props = this.parseOptionsForCurrentState(action.params);
    }

    /**
     * Return a new store that uses this machine. The machine will automatically
     * be started and locked.
     * @return {Store} - The store that contains this machine.
     */

  }, {
    key: 'buildStore',
    value: function buildStore() {
      return (0, _Store.createStore)(this);
    }
  }]);

  return Machine;
}();

/**
 * Creates a new Machine with the given States. This is just syntactic sugar for
 * the following statements: new Machine(...states);
 * @param {Array<State>} states - The states of the machine.
 */


var createMachine = exports.createMachine = function createMachine() {
  for (var _len2 = arguments.length, states = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    states[_key2] = arguments[_key2];
  }

  return new (Function.prototype.bind.apply(Machine, [null].concat(states)))();
};