
// @flow

import { State } from './State';

class Machine {

  current: ?string;
  initial: ?string;
  states: Map<string, State>;
  structure: Map<string, Map<string, string>>;

  constructor(states: Array<State>) {
    if (states.length < 1) { throw new Error('You need at least one state!'); }
    this.states = new Map();
    this.structure = new Map();
    states.forEach((state) => {
      if (!this.initial) this.initial = state.name;
      this.states.set(state.name, state);
      this.structure.set(state.name, new Map());
    });
  }

}

exports.Machine = Machine;
