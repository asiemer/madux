
// @flow

import { State } from './State';
import { Machine } from './Machine';
import type { Action, Middleware, Dispatch } from './Types';

// A default store for Madux.
class Store {

  // The machine of this store.
  machine: Machine;

  // List of subscribers. We have two lists in case dispatch() is called
  // when a listener is added.
  listeners: Array<(prv: ?State, act: Action, nxt: ?State) => void>;
  nextListeners: Array<(prv: ?State, act: Action, nxt: ?State) => void>;

  // A list of middlewares that wrap around the dispatch function.
  middlewares: Array<Middleware>;

  // Create a new store with the predefined machine.
  constructor(machine: Machine, middlewares: Array<Middleware> = []) {
    this.machine = machine;
    this.machine.start();
    this.listeners = [];
    this.nextListeners = this.listeners;
    this.middlewares = middlewares;
    this.middlewares.reverse();
  }

  // Gets the state instance of the machine.
  getState(): ?State { return this.machine.getCurrentState(); }

  // Check if the action can be dispatched and do so.
  // If it is not possible, call invalidAction.
  dispatch(action: Action) {
    this.middlewares.reduce((d: Dispatch, f: Middleware) => f(d), (act: Action) => {
      if (this.machine.canDispatch(act)) {
        const prv = this.machine.getCurrentState();
        this.machine.dispatch(act);
        this.callListeners(prv, act, this.machine.getCurrentState());
      } // OPTIONAL: else { this.invalidAction(act); }
    })(action);
  }

  // Mutates the listeners of this store so there are no
  // conflicts when they are updates while dispatching.
  mutateListeners() {
    if (this.nextListeners === this.listeners) {
      this.nextListeners = this.listeners.slice();
    }
  }

  // Calls every listener of this store with correct arguments.
  callListeners(prv: ?State, act: Action, nxt: ?State) {
    const listeners = this.listeners = this.nextListeners;
    for (let i = 0; i < listeners.length; i += 1) {
      const listener = listeners[i];
      listener(prv, act, nxt);
    }
  }

  // The subscribe function will return an unsubscribe function.
  // The subscribed function is stored in the listeners list.
  subscribe(func: (prv: ?State, act: Action, nxt: ?State) => void) {
    this.mutateListeners();
    this.nextListeners.push(func);
    return () => {
      this.mutateListeners();
      const index = this.nextListeners.indexOf(func);
      this.nextListeners.splice(index, 1);
    };
  }

  // Will be called whenever we receive an action that can not be
  // executed in the current state.
  // OPTIONAL
  // invalidAction(action: Action): void {
  //   const current = this.machine.current || 'null';
  //   winston.warn(`Invalid action ${action.type} in ${current}.`);
  // }

}

exports.Store = Store;
