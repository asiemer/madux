
// @flow

import { Store } from './Store';
import { State } from './State';
import { Machine } from './Machine';
import type { Middleware } from './Types';

exports.createStore = (machine: Machine) => new Store(machine);
exports.createMachine = (states: Array<State>, middlewares: Array<Middleware> = []) =>
  new Machine(states, middlewares);

exports.Machine = Machine;
exports.State = State;
exports.Store = Store;
