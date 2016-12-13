
// @flow

import { Machine } from './Machine';

class FullBound {

  start: string;
  stop: string;
  trigger: string;
  machine: Machine;

  constructor(machine: Machine, start: string, stop: string, trigger: string) {
    if (machine.states.has(start) && machine.states.has(stop)) {
      this.start = start;
      this.stop = stop;
      this.trigger = trigger;
      this.machine = machine;
    } else { throw new Error('Invalid states for machine!'); }
  }

}

class DoubleBound {

  start: string;
  stop: string;
  machine: Machine;

  constructor(machine: Machine, start: string, stop: string) {
    if (machine.states.has(start) && machine.states.has(stop)) {
      this.machine = machine;
      this.start = start;
      this.stop = stop;
    } else { throw new Error('Invalid states for machine!'); }
  }

  on(trigger: string) {
    return new FullBound(this.machine, this.start, this.stop, trigger);
  }

}

class SingleBound {

  start: string;
  machine: Machine;

  constructor(machine: Machine, start: string) {
    if (machine.states.has(start)) {
      this.machine = machine;
      this.start = start;
    } else { throw new Error('Invalid state for machine!'); }
  }

  to(stop: string) {
    return new DoubleBound(this.machine, this.start, stop);
  }

}

exports.SingleBound = SingleBound;
exports.DoubleBound = DoubleBound;
exports.FullBound = FullBound;
