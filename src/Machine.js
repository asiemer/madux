
// @flow

import type { State, Action } from './Types';
import { createConnector, Connector } from './Connector';
import { createSingleBinder, SingleBinder } from './Binders';
import { isValidState, areValidStates, isValidActionForState } from './Utils';

export class Machine {

  locked: boolean;
  initial: string;
  current: ?string;
  states: Map<string, Connector>;

  constructor(...states: Array<State>): void {
    if (states.length >= 1 && areValidStates(states)) {
      this.initial = states[0].name;
      this.states = states.reduce((map, state) =>
        map.set(state.name, createConnector(state)), new Map());
    } else if (states.length < 1) {
      throw new Error(`expected at least one state: ${states.length} given`);
    } else { throw new Error('expected valid states, but arguments are invalid'); }
  }

  stop(): void { this.current = null; }
  start(): void { this.current = this.initial; }
  isStarted(): boolean { return !!this.current; }

  getCurrentState(): ?State {
    const connector = this.current ? this.states.get(this.current) : null;
    return connector ? connector.state : null;
  }

  lock(): void { this.locked = true; }
  unlock(): void { this.locked = false; }
  isLocked(): boolean { return !!this.locked; }

  hasStateName(name: string): boolean { return this.states.has(name); }
  hasState(state: State): boolean {
    const connector = this.states.get(state.name);
    return isValidState(state) && !!connector && connector.state === state;
  }

  from(state: State): SingleBinder { return createSingleBinder(this, state); }

  /**
   * Adds a transition from the given state to the given end state that triggers on the given
   * actionType. Both start and end state should be in this machine. This can only be done when
   * the machine is not locked!
   * @param {State} start - The start state of the transition.
   * @param {string} actionType - The actionType that should trigger the action.
   * @param {State} end - The end state of the transition.
   * @throws {Error} - If and only if the states are invalid, !actionType, the states are not
   *                   available to the machine or the machine is locked.
   */
  addTransition(start: State, actionType: string, end: State): void {
    if (this.isLocked()) { throw new Error('this machine is locked'); }
    if (isValidState(start) && isValidState(end) && actionType) {
      const connectorA = this.states.get(start.name);
      const connectorB = this.states.get(end.name);
      if (connectorA && connectorB && connectorA.state === start && connectorB.state === end) {
        connectorA.addTransitionForwards(actionType, end.name);
        connectorB.addTransitionBackwards(actionType, start.name);
      } else { throw new Error(`states not in this machine: ${start.name} - ${end.name}`); }
    } else { throw new Error(`invalid states for transition: ${start.name} - ${end.name}`); }
  }

  /**
   * Returns whether or not this machine can process the given action at the moment. This is based
   * on whether or not there is a transition leaving from the current state with the given
   * action.type and also the action has all the required properties for the destination state.
   * @param {Action} action - The action that should be checked.
   * @return {boolean} - Whether or not the given action can be processed.
   */
  canProcess(action: Action): boolean {
    const connector = this.current ? this.states.get(this.current) : null;
    const name = connector ? connector.getDestinationStateName(action.type) : null;
    const dest = name ? this.states.get(name) : null;
    return !!connector && !!dest && isValidActionForState(action, dest.state);
  }

  /**
   * Processes the given action when it can be processed (see canProcess(action: Action)).
   * @param {Action} - The action that will be processed.
   * @throws {Error} - If and only if the destination is not found or the action can't be processed.
   */
  process(action: Action): void {
    if (!this.canProcess(action)) { throw new Error('this action can not be processed'); }
    const connectorA = this.current ? this.states.get(this.current) : null;
    const dest = connectorA ? connectorA.getDestinationStateName(action.type) : null;
    if (!dest) { throw new Error('something went wrong, no dest found'); }
    this.current = dest;
  }

}

export const createMachine = (...states: Array<State>) => new Machine(...states);
