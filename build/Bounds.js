'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Machine = require('./Machine');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Represents a stransition from the start to the end state. Note that
// states are always represented by their names! It also has a type
// to know which actiontype will cause this transition to fire.
var FullBound =

// Creates a new isntance  of a transition. Note that when this transition
// is created, it will also be created in the given machine. Of course start
// and end should be names of states that are inside the given machine.


// Type of the action that causes this transition to fire.


// Name of the start state of this transition.
function FullBound(machine, start, end, actionType) {
  _classCallCheck(this, FullBound);

  if (machine.states.has(start) && machine.states.has(end)) {
    this.start = start;
    this.end = end;
    this.actionType = actionType;
    this.machine = machine;
    machine.addTransition(start, end, actionType);
  } else {
    throw new Error('Invalid states for machine!');
  }
}

// The machine on which this transition lives.


// Name of the end state of this transition.
;

// This creates a transition where the actionType that triggers
// the transition is not set yet. This is used to construct the
// cool builder pattern to create transitions.


var DoubleBound = function () {

  // Creates a new instance of this transition, without the actionType
  // that triggers it. Note state the start state and end state should
  // be elements of the given machine.


  // Name of the end state of this transition.
  function DoubleBound(machine, start, end) {
    _classCallCheck(this, DoubleBound);

    if (machine.states.has(start) && machine.states.has(end)) {
      this.machine = machine;
      this.start = start;
      this.end = end;
    } else {
      throw new Error('Invalid states for machine!');
    }
  }

  // Function to complete the builder pattern an combine an actionType
  // that triggers this transition with this transition itself.


  // The machine of this transition.


  // Name of the start state of this transition.


  _createClass(DoubleBound, [{
    key: 'on',
    value: function on(trigger) {
      return new FullBound(this.machine, this.start, this.end, trigger);
    }
  }]);

  return DoubleBound;
}();

// A half transition that is only bound to the start state. It does
// not have an end or actionType that triggers the transition. This
// is used for the builder pattern for transitions.


var SingleBound = function () {

  // Creates a new instance of this SingleBound with given start state
  // end machine. Of course the start state should be inside the given
  // machine.


  // Name of the start state of the transition.
  function SingleBound(machine, start) {
    _classCallCheck(this, SingleBound);

    if (machine.states.has(start)) {
      this.machine = machine;
      this.start = start;
    } else {
      throw new Error('Invalid state for machine!');
    }
  }

  // Returns a DoubleBound to bind an end state to the end of this
  // transition. Used to build transitions.


  // The machine of this transition.


  _createClass(SingleBound, [{
    key: 'to',
    value: function to(stop) {
      return new DoubleBound(this.machine, this.start, stop);
    }
  }]);

  return SingleBound;
}();

exports.SingleBound = SingleBound;
exports.DoubleBound = DoubleBound;
exports.FullBound = FullBound;