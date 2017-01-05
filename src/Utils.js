
// @flow

const OBJSTR = '[object Object]';
const ARRSTR = '[object Array]';

export const isDict = (data: any = []): boolean =>
  !!data && Object.prototype.toString.call(data) === OBJSTR;

export const isArr = (data: any = {}): boolean =>
  !!data && Object.prototype.toString.call(data) === ARRSTR;

export const isValidPropDefinition = (prop: any = {}): boolean =>
  isDict(prop)
  && ('name' in prop)
  && typeof prop.name === 'string'
  && ('required' in prop ? typeof prop.required === 'boolean' : true);

export const areValidPropDefinitions = (props: Array<any> = []): boolean =>
  !!props
  && isArr(props)
  && props.reduce((bool, prop) => bool && isValidPropDefinition(prop), true);

export const isValidState = (state: any = {}): boolean =>
  isDict(state)
  && ('name' in state)
  && typeof state.name === 'string'
  && ('props' in state ? areValidPropDefinitions(state.props) : true);

export const areValidStates = (states: Array<any> = []): boolean =>
  isArr(states) && states.reduce((bool, state) => bool && isValidState(state), true);

// TODO: An action must not have parameters...
export const isValidAction = (action: any = {}): boolean =>
  isDict(action)
  && ('type' in action)
  && typeof action.type === 'string'
  && ('params' in action)
  && isDict(action.params);

export const areValidPropsForPropDefinitions = (params: any = {}, definitions: Array<any> = []) =>
  areValidPropDefinitions(definitions)
  && definitions.reduce((bool, def) => bool && (def.required ? def.name in params : true), true);

export const isValidActionForState = (action: any = {}, state: any = {}): boolean =>
  isValidAction(action)
  && isValidState(state)
  && ('props' in state ? areValidPropsForPropDefinitions(action.params, state.props) : true);
