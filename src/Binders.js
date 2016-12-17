
// @flow

import type { State } from './Types';
import { Machine } from './Machine';

/**
 * The DoubleBinder represents a transition from a given state to a given end state. The actionType
 * that triggers this transition is not known yet. This way the DoubleBinder can be used to make
 * it easy to use a builder pattern while constructing a transition.
 */
export class DoubleBinder {

  start: State;
  end: State;
  machine: Machine;

  constructor(machine: Machine, start: State, end: State): void {
    if (machine.hasState(start) && machine.hasState(end)) {
      this.machine = machine;
      this.start = start;
      this.end = end;
    } else { throw new Error(`invalid states for machine: ${start.name} - ${end.name}`); }
  }

  /**
   * Creates a new transition in the this.machine with from the this.start state to the this.end
   * state on the given actionType. This way this function call is the last one in the series
   * of function calls when creating a transition with the builder pattern.
   * @param {Array<string>} actionTypes - The actionTypes that should trigger the transition.
   * @throws {Error} - When the states are invalid for the machine.
   */
  on(...actionTypes: Array<string>): void {
    if (this.machine.hasState(this.start) && this.machine.hasState(this.end)) {
      actionTypes.forEach(actionType =>
        this.machine.addTransition(this.start, actionType, this.end));
    } else { throw new Error(`invalid states for machine: ${this.start.name} - ${this.end.name}`); }
  }

}

/**
 * This class is a temporary instance that is used while building a transition for the given
 * machine. This class will bind a single State as start state to the transition and provide a
 * function that can be used to convert it to a DoubleBinder.
 */
export class SingleBinder {

  start: State;
  machine: Machine;

  constructor(machine: Machine, start: State): void {
    if (machine.hasState(start)) {
      this.start = start;
      this.machine = machine;
    } else { throw new Error(`invalid state for machine: ${start.name}`); }
  }

  /**
   * Returns a DoubleBinder that has this same start State, but also binds to the given end State.
   * @param {State} end - The end State for the transition.
   * @return {DoubleBinder} - The binder that holds the start and end state.
   */
  to(end: State): DoubleBinder { return new DoubleBinder(this.machine, this.start, end); }

}

/**
 * Creates a new DoubleBinder with the given States and machine. This is just syntactic sugar for
 * the following statements: new DoubleBinder(machine, start, end);
 * @param {Machine} machine - The machine of the Doublebinder.
 * @param {State} start - The start State that the Binder holds.
 * @param {State} end - The end State that the Binder holds.
 */
export const createDoubleBinder = (machine: Machine, start: State, end: State) =>
  new DoubleBinder(machine, start, end);

/**
 * Creates a new SingleBinder with the given State and machine. This is just syntactic sugar for
 * the following statements: new SingleBinder(machine, start);
 * @param {Machine} machine - The machine of the Doublebinder.
 * @param {State} start - The start State that the Binder holds.
 */
export const createSingleBinder = (machine: Machine, start: State) =>
  new SingleBinder(machine, start);
