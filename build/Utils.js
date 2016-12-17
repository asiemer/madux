'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var OBJSTR = '[object Object]';
var ARRSTR = '[object Array]';

var isDict = exports.isDict = function isDict() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return data && Object.prototype.toString.call(data) === OBJSTR;
};

var isArr = exports.isArr = function isArr() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return data && Object.prototype.toString.call(data) === ARRSTR;
};

var isValidPropDefinition = exports.isValidPropDefinition = function isValidPropDefinition() {
  var prop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return isDict(prop) && 'name' in prop && typeof prop.name === 'string' && ('required' in prop ? typeof prop.required === 'boolean' : true);
};

var areValidPropDefinitions = exports.areValidPropDefinitions = function areValidPropDefinitions() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return props && isArr(props) && props.reduce(function (bool, prop) {
    return bool && isValidPropDefinition(prop);
  }, true);
};

var isValidState = exports.isValidState = function isValidState() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return isDict(state) && 'name' in state && typeof state.name === 'string' && ('props' in state ? areValidPropDefinitions(state.props) : true);
};

var areValidStates = exports.areValidStates = function areValidStates() {
  var states = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return isArr(states) && states.reduce(function (bool, state) {
    return bool && isValidState(state);
  }, true);
};

var isValidAction = exports.isValidAction = function isValidAction() {
  var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return isDict(action) && 'name' in action && typeof action.type === 'string' && 'params' in action && isDict(action.params);
};

var areValidPropsForPropDefinitions = exports.areValidPropsForPropDefinitions = function areValidPropsForPropDefinitions() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var definitions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return areValidPropDefinitions(definitions) && definitions.reduce(function (bool, def) {
    return bool && (def.required ? def.name in params : true);
  }, true);
};

var isValidActionForState = exports.isValidActionForState = function isValidActionForState() {
  var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return isValidAction(action) && isValidState(state) && ('props' in state ? areValidPropsForPropDefinitions(action.params, state.props) : true);
};