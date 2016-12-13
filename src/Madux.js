
// @flow

import { Store } from './Store';
import { Machine } from './Machine';
import type { Middleware } from './Types';

export const createStore = (machine: Machine) => new Store(machine);
export const createStoreWithMiddleWare = (ma: Machine, mi: Array<Middleware>) => new Store(ma, mi);
