'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Props = require('./Props');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var State = function () {
  function State(name, props) {
    _classCallCheck(this, State);

    this.name = name;
    this.props = new _Props.Props(props);
  }

  _createClass(State, [{
    key: 'addProp',
    value: function addProp(prop) {
      this.props.addProp(prop);
    }
  }, {
    key: 'validate',
    value: function validate(props) {
      return this.props.validate(props);
    }
  }]);

  return State;
}();

exports.State = State;