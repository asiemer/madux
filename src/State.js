
// @flow

import { Props } from './Props';
import type { Prop, PropDefinition } from './Types';

class State {

  name: string;
  props: Props;

  constructor(name: string, props: Array<PropDefinition>): void {
    this.name = name;
    this.props = new Props(props);
  }

  addProp(prop: PropDefinition): void { this.props.addProp(prop); }
  validate(props: Prop): boolean { return this.props.validate(props); }

}

exports.State = State;
