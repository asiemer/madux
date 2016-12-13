
// @flow

import type { Prop, PropDefinition } from './Types';

// Class with definitions of props to know whether or
// not props can be accepted by a state.
class Props {

  // The defintions of the Props.
  props: Array<PropDefinition>;

  // Creates a new instance with the given defintions.
  constructor(props: Array<PropDefinition>) { this.props = props; }

  // It is also possible to add a definition of a prop after the
  // Props instance is created.
  addProp(prop: PropDefinition) { this.props.push(prop); }

  // Checks if the provided dictionary (props) is can be accepted
  // based on the definitions of this Props instance. This means that
  // every prop which is required, should be in the props dictionary.
  // Optional arguments can be present or not.
  validate(props: Prop): boolean {
    for (let i = 0; i < this.props.length; i += 1) {
      const prop = this.props[i];
      if (prop.required && !(prop.name in props)) { return false; }
    }
    return true;
  }

}

exports.Props = Props;
