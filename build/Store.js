'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _State = require('./State');

var _Machine = require('./Machine');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Store = function () {
  function Store() {
    _classCallCheck(this, Store);

    this.listeners = [];
    this.machine = new _Machine.Machine(new Set());
  }

  // Check if the action can be dispatched and do so.
  // If it is not possible, call invalidAction.


  _createClass(Store, [{
    key: 'dispatch',
    value: function dispatch(action) {
      if (this.machine.canProcess(action)) {
        var _prv = this.machine.getCurrentState();
        this.machine.process(action);
        this.callListeners(_prv, action, this.machine.getCurrentState());
      } else {
        this.invalidAction(action);
      }
    }

    // Calls every listener of this store with correct arguments.

  }, {
    key: 'callListeners',
    value: function callListeners(prv, act, nxt) {
      for (var i = 0; i < this.listeners.length; i += 1) {
        var listener = this.listeners[i];
        listener(prv, act, nxt);
      }
    }

    // The subscribe function will return an unsubscribe function.
    // The subscribed function is stored in the listeners list.

  }, {
    key: 'subscribe',
    value: function subscribe(func) {
      var _this = this;

      var isSubscribed = true;
      this.listeners.push(func);
      return function () {
        if (!isSubscribed) return;
        isSubscribed = false;
        var index = _this.listeners.indexOf(func);
        _this.listeners.splice(index, 1);
      };
    }

    // Will be called whenever we receive an action that can not be
    // executed in the current state.

  }, {
    key: 'invalidAction',
    value: function invalidAction(action) {
      var current = this.machine.current || 'null';
      _winston2.default.error('Invalid action ' + action.type + ' in ' + current + '.');
    }
  }]);

  return Store;
}();

exports.Store = Store;