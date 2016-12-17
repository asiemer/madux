
// @flow

import { isValidState } from './Utils';
import type { State } from './Types';

/**
 * Wrapper class for a basic State instance (see Types for more info). Also includes the references
 * to connections between other states. Note that this Connector instance will only hold identifiers
 * of other states when referring to them in the hashmaps.
 * @author  Jensen Bernard
 */
export class Connector {

  state: State;
  next: Map<string, string>;
  previous: Map<string, Set<string>>;

  /**
   * Creates a new instance of the Connector with the given state. Note that the state should be
   * valid. The constructor will throw an error if this is not the case. The check will be done
   * with the Utils.isValidState(state) function. Read the docs to know when a state instance
   * is valid or not.
   * @param {State} state - The state that the Connector holds or represents.
   * @throws {Error} - If and only if Utils.isValidState(state) returns false.
   */
  constructor(state: State): void {
    if (!isValidState(state)) { throw new Error(`invalid state: ${JSON.stringify(state)}`); }
    this.state = state;
    this.next = new Map();
    this.previous = new Map();
  }

  /**
   * Craft a new transition from the machine that starts from the state of this connector, triggered
   * by an action of the given actionType and ends in the given state. Note that the identifier of
   * the state should be passed (aka the name), instead of the state itself.
   * @param {string} actionType - The actionType that should trigger the transition.
   * @param {string} stateName - The name of the state where this transition leads to.
   * @throws {Error} - If and only if already a transition exists with the given actionType.
   */
  addTransitionForwards(actionType: string, stateName: string): void {
    if (actionType && stateName) {
      if (this.next.has(actionType)) {
        throw new Error(`invalid sequence: ${actionType} - ${stateName}`);
      } else { this.next.set(actionType, stateName); }
    }
  }

  /**
   * Add a reference to a state that leads to this state when the given actionType is dispatched on
   * the given state. For example, connectorStateA.addTransitionBackwards('a', StateB.name) will set
   * a reference for the transitions StateB -> 'a' -> StateA.
   * @param {string} actionType - The actiontype that triggers the transition.
   * @param {string} stateName - The identifier of the state that starts the transition;
   */
  addTransitionBackwards(actionType: string, stateName: string) {
    if (!this.previous.has(actionType)) { this.previous.set(actionType, new Set()); }
    const list = this.previous.get(actionType);
    if (list) list.add(stateName);
  }

  /**
   * Returns the name (identifier) of the state this state leads to when the given actionType is
   * being dispatched. This identifier will be undefined when such a state does not exists.
   * @param {string} actionType - The ActionType that should trigger the action to the state.
   * @return {?string} - The name (identifier) of the state that the given actionType leads to.
   */
  getDestinationStateName(actionType: string): ?string { return this.next.get(actionType); }

  /**
   * Returns a set with identifiers of the states that lead to this state when the given actionType
   * is dispatched. When no such sources exist, an empty set will be returned.
   * @param {string} actionType - The ActionType that should trigger a transition to this state.
   * @return {Set<string>} - A set with the identifiers of the states that lead to this state.
   */
  getSourceStateNames(actionType: string): Set<string> {
    return this.previous.get(actionType) || new Set();
  }

  /**
   * Returns a set of possible actionTypes that can trigger a transition that starts from the
   * state of this Connector.
   * @return {Set<string>} - A set of actionTypes that trigger a transition from this state.
   */
  getPossibleActions(): Set<string> { return new Set(this.next.keys()); }

}

/**
 * Creates a new connector with the given state. This is just syntactic sugar for the following
 * statements: new Connector(state);
 * @param {State} state - The state that the Connector holds or represents.
 * @throws {Error} - If and only if Utils.isValidState(state) returns false.
 */
export const createConnector = (state: State) => new Connector(state);
