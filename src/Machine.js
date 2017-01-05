
// @flow

import type { State, Action } from './Types';
import { createStore, Store } from './Store';
import { createConnector, Connector } from './Connector';
import { createSingleBinder, SingleBinder } from './Binders';
import { isValidState, areValidStates, isValidActionForState, isValidAction } from './Utils';

/**
 * Machine class which represents the internal state machine.
 * @author  Jensen Bernard
 */
export class Machine {

  locked: boolean;
  initial: string;
  current: ?string;
  props: Array<Object>;
  states: Map<string, Connector>;

  constructor(...states: Array<State>): void {
    if (states.length >= 1 && areValidStates(states)) {
      this.initial = states[0].name;
      this.props = [];
      this.states = states.reduce((map, state) =>
        map.set(state.name, createConnector(state)), new Map());
    } else if (states.length < 1) {
      throw new Error(`expected at least one state: ${states.length} given`);
    } else { throw new Error('expected valid states, but arguments are invalid'); }
  }

  stop(): void { this.current = null; }
  start(): void { this.current = this.initial; }
  isStarted(): boolean { return !!this.current; }

  getProps(): Object {
    return this.props.reduce((obj, opt) =>
      Object.assign({}, obj, { [opt.name]: opt.value }), {});
  }

  getPropsToMerge(): Object {
    return this.props.filter(opt => opt.merge).reduce((obj, opt) =>
      Object.assign({}, obj, { [opt.name]: opt.value }), {});
  }

  getMergedProps(action: Action): Object {
    return Object.assign({}, this.getPropsToMerge(), action.params);
  }

  updateActionParameters(action: Action): Object {
    return {
      type: action.type,
      params: this.getMergedProps(action),
    };
  }

  parseOptionsForCurrentState(options: Object): Array<Object> {
    const state = this.getCurrentState();
    if (!state || !state.props) { return []; }
    return state.props.map(prop => ({
      name: prop.name,
      merge: prop.merge,
      value: options[prop.name],
    }));
  }

  getCurrentState(): ?State {
    const connector = this.current ? this.states.get(this.current) : null;
    return connector ? connector.state : null;
  }

  lock(): void { this.locked = true; }
  unlock(): void { this.locked = false; }
  isLocked(): boolean { return !!this.locked; }

  hasStateName(name: string): boolean { return this.states.has(name); }
  hasState(state: State): boolean {
    if (!state) return false;
    const connector = this.states.get(state.name);
    return isValidState(state) && !!connector &&
      JSON.stringify(connector.state) === JSON.stringify(state);
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
    if (isValidState(start) && isValidState(end) && actionType && typeof actionType === 'string') {
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
  canProcess(plain: Action): boolean {
    try {
      this.crashForInvalidAction(plain);
      return true;
    } catch (exc) { return false; }
  }

  /**
   * Does exactly van canProcess does, except it does not return a value but throws an error with
   * description if the machine can't process the action.
   */
  crashForInvalidAction(plain: Action): void {
    if (!plain) throw new Error('action may not be null or undefined');
    if (!isValidAction(plain)) throw new Error('action does not have valid structure');
    const action = this.updateActionParameters(plain);
    if (!this.current) throw new Error('this machine has no current state');
    const connector = this.states.get(this.current);
    if (!connector) throw new Error('this machine has no current state-connector');
    const name = connector.getDestinationStateName(action.type);
    if (!name) throw new Error(`no transition found for type ${action.type}`);
    const dest = this.states.get(name);
    if (!dest) throw new Error(`destination state ${name} not in this machine`);
    if (!isValidActionForState(action, dest.state)) {
      throw new Error(`parameters not correctly instanciated: ${JSON.stringify(action)}`);
    }
  }

  /**
   * Processes the given action when it can be processed (see canProcess(action: Action)).
   * @param {Action} - The action that will be processed.
   * @throws {Error} - If and only if the destination is not found or the action can't be processed.
   */
  process(raw: Action): void {
    const action = this.updateActionParameters(raw);
    if (!this.canProcess(action)) { throw new Error('this action can not be processed'); }
    if (!this.isLocked()) { throw new Error('this machine should be locked'); }
    const connectorA = this.current ? this.states.get(this.current) : null;
    const dest = connectorA ? connectorA.getDestinationStateName(action.type) : null;
    if (!dest) { throw new Error('something went wrong, no dest found'); }
    this.current = dest;
    this.props = this.parseOptionsForCurrentState(action.params);
  }

  /**
   * Return a new store that uses this machine. The machine will automatically
   * be started and locked.
   * @return {Store} - The store that contains this machine.
   */
  buildStore(): Store { return createStore(this); }

}

/**
 * Creates a new Machine with the given States. This is just syntactic sugar for
 * the following statements: new Machine(...states);
 * @param {Array<State>} states - The states of the machine.
 */
export const createMachine = (...states: Array<State>) => new Machine(...states);
