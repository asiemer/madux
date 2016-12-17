
// @flow

export type StatePropDefinition = {
  name: string;
  required: boolean;
};

export type State = {
  name: string;
  props?: Array<StatePropDefinition>;
};

export type Action = {
  type: string;
  params: Object;
};

export type Dispatch = (action: Action) => void;
export type Middleware = (disp: Dispatch) => Dispatch;
