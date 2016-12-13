
// @flow

import { Store } from './Store';
import { Machine } from './Machine';

// Creates a new store.
export default (machine: Machine) => new Store(machine);
