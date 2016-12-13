
// @flow

import { Machine } from './Machine';

// Represents a stransition from the start to the end state. Note that
// states are always represented by their names! It also has a type
// to know which actiontype will cause this transition to fire.
class FullBound {

  // Name of the start state of this transition.
  start: string;

  // Name of the end state of this transition.
  end: string;

  // Type of the action that causes this transition to fire.
  actionType: string;

  // The machine on which this transition lives.
  machine: Machine;

  // Creates a new isntance  of a transition. Note that when this transition
  // is created, it will also be created in the given machine. Of course start
  // and end should be names of states that are inside the given machine.
  constructor(machine: Machine, start: string, end: string, actionType: string): void {
    if (machine.states.has(start) && machine.states.has(end)) {
      this.start = start;
      this.end = end;
      this.actionType = actionType;
      this.machine = machine;
      machine.addTransition(start, end, actionType);
    } else { throw new Error('Invalid states for machine!'); }
  }

}

// This creates a transition where the actionType that triggers
// the transition is not set yet. This is used to construct the
// cool builder pattern to create transitions.
class DoubleBound {

  // Name of the start state of this transition.
  start: string;

  // Name of the end state of this transition.
  end: string;

  // The machine of this transition.
  machine: Machine;

  // Creates a new instance of this transition, without the actionType
  // that triggers it. Note state the start state and end state should
  // be elements of the given machine.
  constructor(machine: Machine, start: string, end: string): void {
    if (machine.states.has(start) && machine.states.has(end)) {
      this.machine = machine;
      this.start = start;
      this.end = end;
    } else { throw new Error('Invalid states for machine!'); }
  }

  // Function to complete the builder pattern an combine an actionType
  // that triggers this transition with this transition itself.
  on(trigger: string): FullBound {
    return new FullBound(this.machine, this.start, this.end, trigger);
  }

}

// A half transition that is only bound to the start state. It does
// not have an end or actionType that triggers the transition. This
// is used for the builder pattern for transitions.
class SingleBound {

  // Name of the start state of the transition.
  start: string;

  // The machine of this transition.
  machine: Machine;

  // Creates a new instance of this SingleBound with given start state
  // end machine. Of course the start state should be inside the given
  // machine.
  constructor(machine: Machine, start: string): void {
    if (machine.states.has(start)) {
      this.machine = machine;
      this.start = start;
    } else { throw new Error('Invalid state for machine!'); }
  }

  // Returns a DoubleBound to bind an end state to the end of this
  // transition. Used to build transitions.
  to(stop: string): DoubleBound { return new DoubleBound(this.machine, this.start, stop); }

}

exports.SingleBound = SingleBound;
exports.DoubleBound = DoubleBound;
exports.FullBound = FullBound;
