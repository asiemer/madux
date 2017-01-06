'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStore = exports.Store = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Machine = require('./Machine');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Store = exports.Store = function () {
  function Store(machine) {
    _classCallCheck(this, Store);

    this.machine = machine;
    this.machine.lock();
    this.machine.start();
    this.listeners = [];
    this.middlewares = [];
    this.nListeners = this.listeners;
    this.nMiddlewares = this.middlewares;
  }

  _createClass(Store, [{
    key: 'mutateListeners',
    value: function mutateListeners() {
      if (this.nListeners === this.listeners) {
        this.nListeners = this.listeners.slice();
      }
    }
  }, {
    key: 'mutateMiddlewares',
    value: function mutateMiddlewares() {
      if (this.nMiddlewares === this.middlewares) {
        this.nMiddlewares = this.middlewares.slice();
      }
    }

    /**
     * Dispatches the given action to the store (and machine). All listeners will be notified when it
     * succeeds. When it fails, an exception will be thrown.
     * @param {Action} action - The action that should be dispatched.
     * @throws {Error} - If and onlt if !this.machine.canProcess(action).
     */

  }, {
    key: 'dispatch',
    value: function dispatch(action) {
      var _this = this;

      var middlewares = this.middlewares = this.nMiddlewares;
      middlewares.reduce(function (d, f) {
        return f(d);
      }, function (finalAction) {
        _this.machine.crashForInvalidAction(finalAction);
        var prv = _this.machine.getCurrentState();
        _this.machine.process(finalAction);
        _this.callListeners(prv, finalAction, _this.machine.getCurrentState());
      })(action);
    }

    /**
     * Makes a backup of the list of listeners of this store and then calls them all with the
     * given previous State, action and next State.
     * @param {?State} prv - The previous State.
     * @param {Action} act - The action.
     * @param {?State} nxt - The next State.
     */

  }, {
    key: 'callListeners',
    value: function callListeners(prv, act, nxt) {
      var listeners = this.listeners = this.nListeners;
      for (var i = 0; i < listeners.length; i += 1) {
        var listener = listeners[i];
        listener(prv, act, nxt);
      }
    }

    /**
     * Adds the given function to the list of listeners so it will be called when the machine updateS.
     * It will return a function that can be called to unsubscribe the function from this store.
     * @param {func} func - The function to substribe.
     * @return {func} - Function to unsubscribe the function.
     */

  }, {
    key: 'subscribe',
    value: function subscribe(func) {
      var _this2 = this;

      if (!func) {
        throw new Error('invalid function');
      }
      this.mutateListeners();
      this.nListeners.push(func);
      return function () {
        _this2.mutateListeners();
        var index = _this2.nListeners.indexOf(func);
        _this2.nListeners.splice(index, 1);
      };
    }

    /**
     * Adds the given middleware to the list of middlewares so it will be called when the machine
     * this store is dispatched. It will return a function that can be called to unsubscribe the
     * function from this store.
     * @param {func} middleware - The middleware to substribe.
     * @return {func} - Function to unsubscribe the function.
     */

  }, {
    key: 'addMiddleware',
    value: function addMiddleware(middleware) {
      var _this3 = this;

      if (!middleware) {
        throw new Error('invalid middleware');
      }
      this.mutateMiddlewares();
      this.nMiddlewares.push(middleware);
      return function () {
        _this3.mutateMiddlewares();
        var index = _this3.nMiddlewares.indexOf(middleware);
        _this3.nMiddlewares.splice(index, 1);
      };
    }

    /**
     * Binds all the given middlewares to the store and returns the store itself.
     * @param {Array<Middleware>} middlewares - The middlewares to add.
     * @return {Store} - The store itself.
     */

  }, {
    key: 'bindMiddleware',
    value: function bindMiddleware() {
      var _this4 = this;

      for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
        middlewares[_key] = arguments[_key];
      }

      middlewares.forEach(function (m) {
        return _this4.addMiddleware(m);
      });
      return this;
    }
  }]);

  return Store;
}();

/**
 * Creates a new Store with the given Machine. This is just syntactic sugar for
 * the following statements: new Store(machine);
 * @param {Machine} machine - The machine of the store.
 */


var createStore = exports.createStore = function createStore(machine) {
  return new Store(machine);
};