
// @flow

import type { Prop, PropDefinition } from './Types';

class Props {

  props: Array<PropDefinition>;
  constructor(props: Array<PropDefinition>) { this.props = props; }
  addProp(prop: PropDefinition) { this.props.push(prop); }

  validate(props: Prop): boolean {
    for (let i = 0; i < this.props.length; i += 1) {
      const prop = this.props[i];
      if (prop.required && !(prop.name in props)) { return false; }
    }
    return true;
  }

}

exports.Props = Props;
