
// @flow

import { Store } from './Store';
import { State } from './State';
import { Machine } from './Machine';

exports.createStore = (machine: Machine) => new Store(machine);

exports.Machine = Machine;
exports.State = State;
