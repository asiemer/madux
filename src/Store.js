
// @flow

import winston from 'winston';
import { State } from './State';
import { Machine } from './Machine';
import type { Action } from './Types';

// A default store for Madux.
// TODO: Custom onInvalidAction handlers?
class Store {

  machine: Machine;
  listeners: Array<(prv: ?State, act: Action, nxt: ?State) => void> = [];
  nextListeners: Array<(prv: ?State, act: Action, nxt: ?State) => void> = [];

  // Create a new store with the predefined machine.
  constructor(machine: Machine) {
    this.machine = machine;
    this.machine.start();
  }

  // Gets the state instance of the machine.
  getState(): ?State { this.machine.getCurrentState(); }

  // Check if the action can be dispatched and do so.
  // If it is not possible, call invalidAction.
  dispatch(action: Action): Action {
    if (this.machine.canProcess(action)) {
      const prv = this.machine.getCurrentState();
      this.machine.process(action);
      this.callListeners(prv, action, this.machine.getCurrentState());
    } else { this.invalidAction(action); }
    return action;
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
    for (let i = 0; i < this.listeners.length; i += 1) {
      const listener = this.listeners[i];
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
  invalidAction(action: Action): void {
    const current = this.machine.current || 'null';
    winston.warn(`Invalid action ${action.type} in ${current}.`);
  }

}

exports.Store = Store;
