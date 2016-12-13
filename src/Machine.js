
// @flow

import { State } from './State';
import { SingleBound } from './Bounds';

class Machine {

  current: ?string;
  initial: ?string;
  states: Map<string, State>;
  structure: Map<string, Map<string, string>>;

  constructor(states: Set<State>) {
    if (states.size < 1) { throw new Error('You need at least one state!'); }
    this.states = new Map();
    this.structure = new Map();
    states.forEach((state) => {
      if (!this.initial) this.initial = state.name;
      this.states.set(state.name, state);
      this.structure.set(state.name, new Map());
    });
  }

  from(name: string): SingleBound { return new SingleBound(this, name); }

  hasState(state: State): boolean { return this.states.has(state.name); }
  hasStateName(name: string): boolean { return this.states.has(name); }

  start() { this.current = this.initial; }
  stop() { this.current = null; }

  isStarted() { return !!this.current; }

}

exports.Machine = Machine;
