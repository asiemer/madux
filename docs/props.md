
# Props in Madux

## Basic Props

In most applications, having a state machine consisting of only basic states just won't be enough. Let's take a look at our previous example again. You might not only want to know that the user is in a room, but you also want to know which room. This means that in order to get into the ROOM state, the 'number' option should be provided by the action that triggered the transition to this room. For example, let's assume that we have the following machine.

```js
import { createMachine } from 'madux';

// Create States
const LOBBY = { name: 'LOBBY' };
const ROOM = { name: 'ROOM' };

// Create Actions
const ENTER = 'ENTER';
const enter = () => ({ type: ENTER });

// Create Machine
const machine = createMachine(LOBBY, ROOM);
machine.from(LOBBY).to(ROOM).on(ENTER);

// Create Store
const store = machine.buildStore();
```

Right now, when we dispatch the enter action we will get in the ROOM state without having any problems. That's not what we want because we never want to get into the ROOM state without a 'number' parameter. We can solve this by updating the state definition of ROOM so we won't be able to dispatch the enter action anymore!

```js
import { createMachine } from 'madux';

// Update States
const LOBBY = { name: 'LOBBY' };
const ROOM = {
  name: 'ROOM',
  props: [{
    name: 'number',
    required: true,
  }],
};

const ENTER = 'ENTER';
const enter = () => ({ type: ENTER });

const machine = createMachine(LOBBY, ROOM);
machine.from(LOBBY).to(ROOM).on(ENTER);

const store = machine.buildStore();

// This will throw an error! No valid state found...
store.dispatch(enter());
```

When we dispatch the enter action, the only possible destination state is ROOM. This state is invalid whatsoever, because it requires a 'number' property which is not given by the enter action. We can fix this by adding a parameter to the action as shown below.

```js
import { createMachine } from 'madux';

const LOBBY = { name: 'LOBBY' };
const ROOM = {
  name: 'ROOM',
  props: [{
    name: 'number',
    required: true,
  }],
};

// Update Action Creator
const ENTER = 'ENTER';
const enter = number => ({ type: ENTER, params: { number } });

const machine = createMachine(LOBBY, ROOM);
machine.from(LOBBY).to(ROOM).on(ENTER);

const store = machine.buildStore();

// Now this will work! We enter ROOM with ROOM.options.number === 13.
store.dispatch(enter(13));
```

## Advanced Props

We just learned how to expand a basic state machine to a machine with states that each have different properties throughout the application lifecycle. However, sometimes you might want to pass options of the current state to the next state. To illustrate this, let's assume we add a SEND action to the previous example.

```js
import { createMachine } from 'madux';

const LOBBY = { name: 'LOBBY' };
const ROOM = {
  name: 'ROOM',
  props: [{
    name: 'number',
    required: true,
  }],
};

// Add SEND Action
const ENTER = 'ENTER';
const SEND = 'SEND';
const enter = number => ({ type: ENTER, params: { number } });
const send = message => ({ type: SEND, params: { message } });

const machine = createMachine(LOBBY, ROOM);
machine.from(LOBBY).to(ROOM).on(ENTER);
machine.from(ROOM).to(ROOM).on(SEND);

const store = machine.buildStore();

store.dispatch(enter(13));

// This will throw an error! You see why?
store.dispatch(send('Hello Friends!'));
```

By dispatching the SEND action, you want to access the room state again. Because this state requires a room number, you won't be able to access the ROOM state. The best way to solve this problem, is by adding the 'merge' option to the 'number' prop. This means that whenever an action is dispatched from this state, the 'number' will be merged with the props of the dispatched action. This results in the following action that will be dispatched.

```js
// When we update ROOM to this...
const ROOM = {
  name: 'ROOM',
  props: [{
    name: 'number',
    merge: true,
    required: true,
  }],
};

// The ACTUAL dispatched action will be like this...
const action = {
  type: SEND,
  params: {
    number: 13,
    message: 'Hello Friends!',
  },
};
```

Not that passed parameters are stronger then state options. That means that if action.params.numbers was already set by the action creator, it won't be overwritten.
