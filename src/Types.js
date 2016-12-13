
// @flow

export type PropDefinition = {
  name: string;
  required: boolean;
};

export type Prop = Object;

export type Action = {
  type: string;
  params: Object;
};

export type Dispatch = (action: Action) => void;

export type Middleware = (disp: Dispatch) => Dispatch;
