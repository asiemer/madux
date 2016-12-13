
// @flow

import { Props } from './Props';
import type { Prop, PropDefinition } from './Types';

// Represents a state of the machine with some property
// definitions. This makes it possible to check if actions
// are valid to go to the given state.
class State {

  // The name of the state.
  name: string;

  // The propdefinitions of this state.
  props: Props;

  // Creates a new instance with given name and propertydefinitions.
  // If no definitions are given, this state will always accept the
  // parameters of an action.
  constructor(name: string, props: Array<PropDefinition>): void {
    this.name = name;
    this.props = new Props(props);
  }

  // Adds a defintion of a prop to this state.
  addProp(prop: PropDefinition): void { this.props.addProp(prop); }

  // Checks whether or not the given props are valid for this state.
  validate(props: Prop): boolean { return this.props.validate(props); }

}

exports.State = State;
