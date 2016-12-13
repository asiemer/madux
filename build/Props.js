'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Class with definitions of props to know whether or
// not props can be accepted by a state.
var Props = function () {

  // Creates a new instance with the given defintions.
  function Props() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    _classCallCheck(this, Props);

    this.props = props;
  }

  // It is also possible to add a definition of a prop after the
  // Props instance is created.


  // The defintions of the Props.


  _createClass(Props, [{
    key: 'addProp',
    value: function addProp(prop) {
      this.props.push(prop);
    }

    // Checks if the provided dictionary (props) is can be accepted
    // based on the definitions of this Props instance. This means that
    // every prop which is required, should be in the props dictionary.
    // Optional arguments can be present or not.

  }, {
    key: 'validate',
    value: function validate(props) {
      for (var i = 0; i < this.props.length; i += 1) {
        var prop = this.props[i];
        if (prop.required && !(prop.name in props)) {
          return false;
        }
      }
      return true;
    }
  }]);

  return Props;
}();

exports.Props = Props;