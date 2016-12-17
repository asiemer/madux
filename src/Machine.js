
// @flow

import { State } from './State';
import { SingleBound } from './Bounds';
import type { Action } from './Types';

class Machine {

  current: ?string;
  initial: string;
  states: Map<string, State>;
  structure: Map<string, Map<string, string>>;

  constructor(states: Array<State>): void {
    if (states.length < 1) { throw new Error('You need at least one state!'); }
    this.states = new Map();
    this.structure = new Map();
    states.forEach((state) => {
      if (!this.initial) this.initial = state.name;
      this.states.set(state.name, state);
      this.structure.set(state.name, new Map());
    });
  }

  // Function that creates a SingleBound to start building a transition.
  from(state: State): SingleBound { return new SingleBound(this, state); }

  // Checks if this machine has the given state (with the same name).
  hasState(state: State): boolean { return this.hasStateName(state.name); }

  // Checks if this machine has a state with given name.
  hasStateName(name: string): boolean { return this.states.has(name); }

  // Initializes the current state to the initial state.
  start(): void { this.current = this.initial; }

  // Sets the current state to null.
  stop(): void { this.current = null; }

  // Checks if the current state is set.
  isStarted(): boolean { return !!this.current; }

  // Returns the current state if this machine is started. If not,
  // it returns null.
  getCurrentState(): ?State {
    return this.current ? this.states.get(this.current) : null;
  }

  // Creates a transition from the start state to the end state which
  // triggers on the given actionType.
  addTransition(start: State, end: State, actionType: string): void {
    if (this.structure.has(start.name) && this.structure.has(end.name)) {
      const maps = this.structure.get(start.name);
      if (!maps) {
        const newMap = new Map();
        newMap.set(actionType, end.name);
        this.structure.set(start.name, newMap);
      } else { maps.set(actionType, end.name); }
    } else { throw new Error('Invalid transition for machine!'); }
  }

  // Checks if the machine can dispatch the given action at
  // this moment. This means it is started yet, there is a transition
  // that is triggered by this action that starts from the current
  // state and the action has all the params needed for the destination
  // state.
  canDispatch(action: Action): boolean {
    if (this.current && this.structure.has(this.current)) {
      const transitions = this.structure.get(this.current);
      if (transitions && transitions.has(action.type)) {
        const destination = transitions.get(action.type);
        if (destination) {
          const state = this.states.get(destination);
          if (state) { return state.validate(action.params); }
        }
      }
    }
    return false;
  }

  // Dispatches the given action. If, for some reason, this state
  // machine can not dispatch, it will ignore the input.
  dispatch(action: Action) {
    if (this.canDispatch(action)) {
      if (!this.current) { throw new Error('This machine is not started!'); }
      const maps = this.structure.get(this.current);
      if (maps) {
        const destination = maps.get(action.type);
        if (destination) this.current = destination;
        if (!destination) throw new Error('No destination found!');
      } else { throw new Error('No map found, fatal!'); }
    }
  }

}

exports.Machine = Machine;
