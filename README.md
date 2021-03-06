
<p align="center">
  <br />
  <br />
  <img src="http://i.imgur.com/8ZLX6ti.png" width="500" />
  <br />
  <br />
  <br />
  <img src="https://img.shields.io/badge/status-development-16a085.svg">
  <img src="https://travis-ci.org/Jense5/madux.svg?branch=master">
  <img src="https://img.shields.io/npm/v/madux.svg">
  <img src="https://img.shields.io/npm/l/madux.svg">
  <a href="https://gitter.im/madux-dev/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link"><img src="https://img.shields.io/gitter/room/gitterHQ/gitter.svg"></a>
  <br />
  <br />
</p>

**Madux** is an easy way to represent the internal state of your application as a finite state machine. It can be used in lots of different ways. If you are looking to use madux in your own application, I advise you to take a look at **[Madux-bind](https://github.com/Jense5/madux-bind)** which allows you to connect functions to different transitions of the internal state. This makes it easy to create an application with madux in some kind of declarative way. I am currently writing a real-life command line tool with madux and I will publish a link here when it is finished. I do assume in the example below that you already know the basics of **[Redux](https://github.com/reactjs/redux)**.

Note that this is just a proof-of-concept and not a commercial release so it might be possible that there is some functionality that can be implemented in a more efficient way. However, this library should be stable (run `yarn test` to see for yourself or check the build badge).

Install it via **npm** - `$ npm install --save madux`

<h1 align="center">Basic Snippet</h1>

```js
import { createMachine } from 'madux';

// Create a basic state machine.
const machine = createMachine('green', 'red');
machine.from('green').to('red').on('error');
machine.from('red').to('green').on('fix');

// Convert it to a store for your state.
const store = machine.buildStore();

// Subscribe to the state.
store.subscribe((prev, action, next) => {
  console.log(prev);
  console.log(action);
  console.log(next);
});

// Have fun!
store.dispatch({ type: 'error' });  // Will log...
store.dispatch({ type: 'fix' });    // Will log...
```

<h1 align="center">A First Madux Example</h1>

<p align="center">
  <img src="http://i.imgur.com/Jdehzch.png" />
</p>

## Defining States
The first thing you should do when creating a state machine with madux, is thinking about the possible states. In our example we will have three states: `OUTSIDE`, `HOUSE`, and `ROOM`. Let's start these as plain JavaScript objects.

```js
// A state is just a plain javascript object with a name property.
const OUTSIDE = { name: 'OUTSIDE' };
const HOUSE = { name: 'HOUSE' };
const ROOM = { name: 'ROOM' };
```

In some use cases, these basic states might do the trick. In our example we need a bit more data. For example when we are in a `HOUSE`, we also want to know the number of the house we are in. To do so, we can add props to different states. Note that when we are in the `ROOM` state we need to have the `houseNumber` and `roomNumber` data in order to know the exact room we are in.

```js
// Update the states to have some basic properties. As you can see below, it
// is also possible to add optional properties by setting required to false.

const OUTSIDE = { name: 'OUTSIDE' };

const HOUSE = {
  name: 'HOUSE',
  props: [{
    name: 'houseNumber',
    required: true,
  }],
};

const ROOM = {
  name: 'ROOM',
  props: [{
    name: 'houseNumber',
    required: true,
  }, {
    name: 'roomNumber',
    required: true,
  }],
};
```

Note that there is one small issue in the definition of these states that we will fix later. For now, let's assume that these states will do the trick.

## Actions
Different transitions of the finite state machine can be triggered by different actions. An action is a simple JavaScript object with a type property. The type of the Action should be a predefined string. Let's start by creating the different action types.

```js
// Action types can be represented as simple strings. It is advised to store
// them in variables to prevent some stupid errors. In our example, we only need
// four different action types.
const ENTER_HOUSE = 'ENTER_HOUSE'
const LEAVE_HOUSE = 'LEAVE_HOUSE';
const ENTER_ROOM = 'ENTER_ROOM';
const LEAVE_ROOM = 'LEAVE_ROOM';

// A simple ENTER_HOUSE Action would now look like this.
const action = { type: ENTER_HOUSE };
```

Note that in order to go from one state to the other with a given action, the parameters of the action should fullfil the properties of the destination state. This means that in order to be able to go from `OUTSIDE` to `ROOM`, the action should look like this.

```js
// Note that the houseNumber can be whatever you want.
const action = {
  type: ENTER_HOUSE,
  params: {
    houseNumber: 5,
  },
};
```

## Action Creators

In order to be consistent throughout your application, it is advised to use action creators. These
are simple functions that accept parameters in order to create actions. For our four action types,
we need four action creators.

```js
// Create some basic action creators.
const enterHouse = houseNumber => ({ type: ENTER_HOUSE, params: { houseNumber } });
const enterRoom = roomNumber => ({ type: ENTER_ROOM, params: { roomNumber } });
const leaveHouse = () => ({ type: LEAVE_HOUSE });
const leaveRoom = () => ({ type: LEAVE_ROOM });
```

Note that we did not set a `houseNumber` parameter for the `ENTER_ROOM` action. As you have seen before,
it will now be impossible to access the `ROOM` state without the `houseNumber` parameter. It's
trivial to see that you don't want to pass the `roomNumber` and `houseNumber` to the state when it
should already know in which house you are. This can be solved by the build-in merge feature.

For now, a property that we define in the definition of a state has only a name and a value that
represents whether or not the property is required. We will add a third (optional) value, namely merge.
When merge is true, it will merge the current value of the prop with the properties of the action
that is dispatched. So by making `roomNumber` a merged property, it will automatically be added
to all outgoing actions so future states know from which room the action came!

```js
// Lets update our ROOM state to this.
const HOUSE = {
  name: 'HOUSE',
  props: [{
    name: 'houseNumber',
    required: true,
    merge: true,
  }],
};
```

So from now on we don't have to pass the `houseNumber` anymore when we leave from the `HOUSE` state.

#### Recap

Up till now, we have defined our states, action types that might trigger some transitions and the
action creators. Because we are working in a single file for this example, our file now looks like this.

```js

const OUTSIDE = { name: 'OUTSIDE' };
const HOUSE = {
  name: 'HOUSE',
  props: [{
    name: 'houseNumber',
    required: true,
    merge: true,
  }],
};
const ROOM = {
  name: 'ROOM',
  props: [{
    name: 'houseNumber',
    required: true,
  }, {
    name: 'roomNumber',
    required: true,
  }],
};

const ENTER_HOUSE = 'ENTER_HOUSE'
const LEAVE_HOUSE = 'LEAVE_HOUSE';
const ENTER_ROOM = 'ENTER_ROOM';
const LEAVE_ROOM = 'LEAVE_ROOM';

const enterHouse = houseNumber => ({ type: ENTER_HOUSE, params: { houseNumber } });
const enterRoom = roomNumber => ({ type: ENTER_ROOM, params: { roomNumber } });
const leaveHouse = () => ({ type: LEAVE_HOUSE });
const leaveRoom = () => ({ type: LEAVE_ROOM });

```

## Defining The State Machine

We have all the elements for our state machine right now, but haven't defined our state machine itself.
This is possible by importing the `createMachine` function from madux and use the builder pattern
as shown below. Note that the order of the states are not important, however the first state will
be the initial state.

```js
import { createMachine } from 'madux';

// Define our machine!
const machine = createMachine(OUTSIDE, HOUSE, ROOM);
machine.from(OUTSIDE).to(HOUSE).on(ENTER_HOUSE);
machine.from(HOUSE).to(OUTSIDE).on(LEAVE_HOUSE);
machine.from(HOUSE).to(ROOM).on(ENTER_ROOM);
machine.From(ROOM).to(HOUSE).on(LEAVE_HOUSE);
```

## Building a store

Right now, the only thing we still have to do is build a store which holds our state. You can see the store as some kind
of redux-like store, but it works different internally. So dispatch any actions you want from now on!

```js
const store = machine.buildStore();

// You can also subscribe to the store.
// The subscribe function will return a function that makes it possible to unsubscribe.
const unsubscribe = store.subscribe((prev, action, next) => {
  // This function will now be called on every transition!
});

store.dispatch(enterHouse(5));
store.disptach(enterRoom(3));
store.dispatch(leaveRoom());

unsubscribe();

```

## Middleware

It is also possible to add middleware. I will add more documentation about this in the future. If
you really need it, check the tests. Basically it can be done like this.

```js
const store = machine.buildStore().bindMiddlewares(middlewareA, middlewareB);
```

## More info

Ask me on [Twitter](https://twitter.com/PreShove) or [Gitter](https://gitter.im/madux-dev/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link).
