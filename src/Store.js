
// @flow

import { Machine } from './Machine';
import type { Action, Middleware, Dispatch, State } from './Types';

export class Store {

  machine: Machine;
  listeners: Array<(prv: ?State, act: Action, nxt: ?State) => void>;
  nListeners: Array<(prv: ?State, act: Action, nxt: ?State) => void>;
  middlewares: Array<Middleware>;
  nMiddlewares: Array<Middleware>;

  constructor(machine: Machine) {
    this.machine = machine;
    this.machine.lock();
    this.machine.start();
    this.listeners = [];
    this.middlewares = [];
    this.nListeners = this.listeners;
    this.nMiddlewares = this.middlewares;
  }

  mutateListeners() {
    if (this.nListeners === this.listeners) {
      this.nListeners = this.listeners.slice();
    }
  }

  mutateMiddlewares() {
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
  dispatch(action: Action) {
    const middlewares = this.middlewares = this.nMiddlewares;
    middlewares.reduce((d: Dispatch, f: Middleware) => f(d), (finalAction: Action) => {
      if (this.machine.canProcess(finalAction)) {
        const prv = this.machine.getCurrentState();
        this.machine.process(finalAction);
        this.callListeners(prv, finalAction, this.machine.getCurrentState());
      } else { throw new Error(`unable to process action: ${action.type}`); }
    })(action);
  }

  /**
   * Makes a backup of the list of listeners of this store and then calls them all with the
   * given previous State, action and next State.
   * @param {?State} prv - The previous State.
   * @param {Action} act - The action.
   * @param {?State} nxt - The next State.
   */
  callListeners(prv: ?State, act: Action, nxt: ?State) {
    const listeners = this.listeners = this.nListeners;
    for (let i = 0; i < listeners.length; i += 1) {
      const listener = listeners[i];
      listener(prv, act, nxt);
    }
  }

  /**
   * Adds the given function to the list of listeners so it will be called when the machine updateS.
   * It will return a function that can be called to unsubscribe the function from this store.
   * @param {func} func - The function to substribe.
   * @return {func} - Function to unsubscribe the function.
   */
  subscribe(func: (prv: ?State, act: Action, nxt: ?State) => void) {
    if (!func) { throw new Error('invalid function'); }
    this.mutateListeners();
    this.nListeners.push(func);
    return () => {
      this.mutateListeners();
      const index = this.nListeners.indexOf(func);
      this.nListeners.splice(index, 1);
    };
  }

  /**
   * Adds the given middleware to the list of middlewares so it will be called when the machine
   * this store is dispatched. It will return a function that can be called to unsubscribe the
   * function from this store.
   * @param {func} middleware - The middleware to substribe.
   * @return {func} - Function to unsubscribe the function.
   */
  addMiddleware(middleware: Middleware) {
    if (!middleware) { throw new Error('invalid middleware'); }
    this.mutateMiddlewares();
    this.nMiddlewares.push(middleware);
    return () => {
      this.mutateMiddlewares();
      const index = this.nMiddlewares.indexOf(middleware);
      this.nMiddlewares.splice(index, 1);
    };
  }

  /**
   * Binds all the given middlewares to the store and returns the store itself.
   * @param {Array<Middleware>} middlewares - The middlewares to add.
   * @return {Store} - The store itself.
   */
  bindMiddleware(...middlewares: Array<Middleware>): Store {
    middlewares.forEach(m => this.addMiddleware(m));
    return this;
  }

}

/**
 * Creates a new Store with the given Machine. This is just syntactic sugar for
 * the following statements: new Store(machine);
 * @param {Machine} machine - The machine of the store.
 */
export const createStore = (machine: Machine) => new Store(machine);
