'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _State = require('./State');

var _Machine = require('./Machine');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// A default store for Madux.
var Store = function () {

  // Create a new store with the predefined machine.


  // List of subscribers. We have two lists in case dispatch() is called
  // when a listener is added.
  function Store(machine) {
    _classCallCheck(this, Store);

    this.machine = machine;
    this.machine.start();
    this.listeners = [];
    this.nextListeners = this.listeners;
  }

  // Gets the state instance of the machine.


  // The machine of this store.


  _createClass(Store, [{
    key: 'getState',
    value: function getState() {
      return this.machine.getCurrentState();
    }

    // Check if the action can be dispatched and do so.
    // If it is not possible, call invalidAction.

  }, {
    key: 'dispatch',
    value: function dispatch(action) {
      if (this.machine.canDispatch(action)) {
        var _prv = this.machine.getCurrentState();
        this.machine.dispatch(action);
        this.callListeners(_prv, action, this.machine.getCurrentState());
      } // OPTIONAL: else { this.invalidAction(action); }
      return action;
    }

    // Mutates the listeners of this store so there are no
    // conflicts when they are updates while dispatching.

  }, {
    key: 'mutateListeners',
    value: function mutateListeners() {
      if (this.nextListeners === this.listeners) {
        this.nextListeners = this.listeners.slice();
      }
    }

    // Calls every listener of this store with correct arguments.

  }, {
    key: 'callListeners',
    value: function callListeners(prv, act, nxt) {
      var listeners = this.listeners = this.nextListeners;
      for (var i = 0; i < listeners.length; i += 1) {
        var listener = listeners[i];
        listener(prv, act, nxt);
      }
    }

    // The subscribe function will return an unsubscribe function.
    // The subscribed function is stored in the listeners list.

  }, {
    key: 'subscribe',
    value: function subscribe(func) {
      var _this = this;

      this.mutateListeners();
      this.nextListeners.push(func);
      return function () {
        _this.mutateListeners();
        var index = _this.nextListeners.indexOf(func);
        _this.nextListeners.splice(index, 1);
      };
    }

    // Will be called whenever we receive an action that can not be
    // executed in the current state.
    // OPTIONAL
    // invalidAction(action: Action): void {
    //   const current = this.machine.current || 'null';
    //   winston.warn(`Invalid action ${action.type} in ${current}.`);
    // }

  }]);

  return Store;
}();

exports.Store = Store;