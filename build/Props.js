'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Props = function () {
  function Props(props) {
    _classCallCheck(this, Props);

    this.props = props;
  }

  _createClass(Props, [{
    key: 'addProp',
    value: function addProp(prop) {
      this.props.push(prop);
    }
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