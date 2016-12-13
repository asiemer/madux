
// @flow

import winston from 'winston';
import { State } from './State';
import { Machine } from './Machine';
import type { Action } from './Types';

class Store {

  machine: Machine;
  listeners: Array<(prv: ?State, act: Action, nxt: ?State) => void>;

  constructor() {
    this.listeners = [];
    this.machine = new Machine(new Set());
  }

  // Check if the action can be dispatched and do so.
  // If it is not possible, call invalidAction.
  dispatch(action: Action): void {
    if (this.machine.canProcess(action)) {
      const prv = this.machine.getCurrentState();
      this.machine.process(action);
      this.callListeners(prv, action, this.machine.getCurrentState());
    } else { this.invalidAction(action); }
  }

  // Calls every listener of this store with correct arguments.
  callListeners(prv: ?State, act: Action, nxt: ?State) {
    for (let i = 0; i < this.listeners.length; i += 1) {
      const listener = this.listeners[i];
      listener(prv, act, nxt);
    }
  }

  // The subscribe function will return an unsubscribe function.
  // The subscribed function is stored in the listeners list.
  subscribe(func: (prv: ?State, act: Action, nxt: ?State) => void) {
    let isSubscribed = true;
    this.listeners.push(func);
    return () => {
      if (!isSubscribed) return;
      isSubscribed = false;
      const index = this.listeners.indexOf(func);
      this.listeners.splice(index, 1);
    };
  }

  // Will be called whenever we receive an action that can not be
  // executed in the current state.
  invalidAction(action: Action): void {
    const current = this.machine.current || 'null';
    winston.error(`Invalid action ${action.type} in ${current}.`);
  }

}

exports.Store = Store;
