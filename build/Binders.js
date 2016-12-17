'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSingleBinder = exports.createDoubleBinder = exports.SingleBinder = exports.DoubleBinder = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Machine = require('./Machine');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The DoubleBinder represents a transition from a given state to a given end state. The actionType
 * that triggers this transition is not known yet. This way the DoubleBinder can be used to make
 * it easy to use a builder pattern while constructing a transition.
 */
var DoubleBinder = exports.DoubleBinder = function () {
  function DoubleBinder(machine, start, end) {
    _classCallCheck(this, DoubleBinder);

    if (machine.hasState(start) && machine.hasState(end)) {
      this.machine = machine;
      this.start = start;
      this.end = end;
    } else {
      throw new Error('invalid states for machine: ' + start.name + ' - ' + end.name);
    }
  }

  /**
   * Creates a new transition in the this.machine with from the this.start state to the this.end
   * state on the given actionType. This way this function call is the last one in the series
   * of function calls when creating a transition with the builder pattern.
   * @param {Array<string>} actionTypes - The actionTypes that should trigger the transition.
   * @throws {Error} - When the states are invalid for the machine.
   */


  _createClass(DoubleBinder, [{
    key: 'on',
    value: function on() {
      var _this = this;

      if (this.machine.hasState(this.start) && this.machine.hasState(this.end)) {
        for (var _len = arguments.length, actionTypes = Array(_len), _key = 0; _key < _len; _key++) {
          actionTypes[_key] = arguments[_key];
        }

        actionTypes.forEach(function (actionType) {
          return _this.machine.addTransition(_this.start, actionType, _this.end);
        });
      } else {
        throw new Error('invalid states for machine: ' + this.start.name + ' - ' + this.end.name);
      }
    }
  }]);

  return DoubleBinder;
}();

/**
 * This class is a temporary instance that is used while building a transition for the given
 * machine. This class will bind a single State as start state to the transition and provide a
 * function that can be used to convert it to a DoubleBinder.
 */


var SingleBinder = exports.SingleBinder = function () {
  function SingleBinder(machine, start) {
    _classCallCheck(this, SingleBinder);

    if (machine.hasState(start)) {
      this.start = start;
      this.machine = machine;
    } else {
      throw new Error('invalid state for machine: ' + start.name);
    }
  }

  /**
   * Returns a DoubleBinder that has this same start State, but also binds to the given end State.
   * @param {State} end - The end State for the transition.
   * @return {DoubleBinder} - The binder that holds the start and end state.
   */


  _createClass(SingleBinder, [{
    key: 'to',
    value: function to(end) {
      return new DoubleBinder(this.machine, this.start, end);
    }
  }]);

  return SingleBinder;
}();

/**
 * Creates a new DoubleBinder with the given States and machine. This is just syntactic sugar for
 * the following statements: new DoubleBinder(machine, start, end);
 * @param {Machine} machine - The machine of the Doublebinder.
 * @param {State} start - The start State that the Binder holds.
 * @param {State} end - The end State that the Binder holds.
 */


var createDoubleBinder = exports.createDoubleBinder = function createDoubleBinder(machine, start, end) {
  return new DoubleBinder(machine, start, end);
};

/**
 * Creates a new SingleBinder with the given State and machine. This is just syntactic sugar for
 * the following statements: new SingleBinder(machine, start);
 * @param {Machine} machine - The machine of the Doublebinder.
 * @param {State} start - The start State that the Binder holds.
 */
var createSingleBinder = exports.createSingleBinder = function createSingleBinder(machine, start) {
  return new SingleBinder(machine, start);
};