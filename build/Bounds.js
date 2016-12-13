'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Machine = require('./Machine');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FullBound = function FullBound(machine, start, stop, trigger) {
  _classCallCheck(this, FullBound);

  if (machine.states.has(start) && machine.states.has(stop)) {
    this.start = start;
    this.stop = stop;
    this.trigger = trigger;
    this.machine = machine;
  } else {
    throw new Error('Invalid states for machine!');
  }
};

var DoubleBound = function () {
  function DoubleBound(machine, start, stop) {
    _classCallCheck(this, DoubleBound);

    if (machine.states.has(start) && machine.states.has(stop)) {
      this.machine = machine;
      this.start = start;
      this.stop = stop;
    } else {
      throw new Error('Invalid states for machine!');
    }
  }

  _createClass(DoubleBound, [{
    key: 'on',
    value: function on(trigger) {
      return new FullBound(this.machine, this.start, this.stop, trigger);
    }
  }]);

  return DoubleBound;
}();

var SingleBound = function () {
  function SingleBound(machine, start) {
    _classCallCheck(this, SingleBound);

    if (machine.states.has(start)) {
      this.machine = machine;
      this.start = start;
    } else {
      throw new Error('Invalid state for machine!');
    }
  }

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