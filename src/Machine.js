
// @flow

import { State } from './State';
import { SingleBound } from './Bounds';
import type { Action, Middleware, Dispatch } from './Types';

// Represents a state machine that will handle all the internal logic.
class Machine {

  // The name of the current state of the machine, null if not started yet.
  current: ?string;

  // The name of the initial state of the machine. This is the first state
  // given to the constructor.
  initial: string;

  // A map of all the states which maps the names to the states for
  // O(1) lookup.
  states: Map<string, State>;

  // The internal structure which represents the transitions. In general
  // it works like this: this.structure.get(start).get(actionType) = destination.
  structure: Map<string, Map<string, string>>;

  // A list of middlewares that wrap around the dispatch function.
  middlewares: Array<Middleware>;

  // Creates a new instance of a state machine with the given states and
  // middlewares. The first given state will be the initial state.
  // The list of middlewares will be wrapped around the dispatch function
  // in the order as they are provided. The created machine has no transitions.
  constructor(states: Array<State>, middlewares: Array<Middleware> = []): void {
    if (states.length < 1) { throw new Error('You need at least one state!'); }
    this.states = new Map();
    this.structure = new Map();
    this.middlewares = [];
    states.forEach((state) => {
      if (!this.initial) this.initial = state.name;
      this.states.set(state.name, state);
      this.structure.set(state.name, new Map());
    });
    this.middlewares = middlewares;
    this.middlewares.reverse();
  }

  // Function that creates a SingleBound to start building a transition.
  from(name: string): SingleBound { return new SingleBound(this, name); }

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
  addTransition(start: string, end: string, actionType: string): void {
    if (this.structure.has(start) && this.structure.has(end)) {
      const maps = this.structure.get(start);
      if (!maps) {
        const newMap = new Map();
        newMap.set(actionType, end);
        this.structure.set(start, newMap);
      } else { maps.set(actionType, end); }
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
      this.middlewares.reduce((d: Dispatch, f: Middleware) => f(d), (act: Action) => {
        if (!this.current) { throw new Error('This machine is not started!'); }
        const maps = this.structure.get(this.current);
        if (maps) {
          const destination = maps.get(act.type);
          if (destination) this.current = destination;
          if (!destination) throw new Error('No destination found!');
        } else { throw new Error('No map found, fatal!'); }
      })(action);
    }
  }

}

exports.Machine = Machine;
