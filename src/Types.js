
// @flow

// Defines a Prop of a State. It only requires a name and
// a boolean on whether or not this Prop is required.
export type PropDefinition = {
  name: string;
  required: boolean;
};

// A Prop is an instance of a PropDefinition. It is just
// a regular JS object.
export type Prop = Object;

// An Action is the type that will be passed to the
// dispatch method of the Store. It has a type and
// optional parameters.
export type Action = {
  type: string;
  params: Object;
};

// The format of the dispatch function. Used to define
// it within the middlewares.
export type Dispatch = (action: Action) => void;

// A middleware function takes a dispatch as input and
// returns a new wrapped dispatch method.
export type Middleware = (disp: Dispatch) => Dispatch;
