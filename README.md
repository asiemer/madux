
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
  <br />
  <br />
</p>

**Madux** is an easy way to represent the internal state of your application as a finite state machine. It can be used in lots of different ways. If you are looking to use madux in your own application, I advise you to take a look at **[Madux-bind](https://github.com/Jense5/madux-bind)** which allows you to connect functions to different transitions of the internal state. This makes it easy to create an application with madux in some kind of declarative way. I am currently writing a real-life command line tool with madux and I will publish a link here when it is finished.

Install it via **npm** - `$ npm install --save madux`

### Basic Madux Example

<p align="center">
  <img src="http://i.imgur.com/Jdehzch.png" />
</p>

##### Defining States
The first thing you should do when creating a state machine with madux, is thinking about the possible states. In our example we will have three states: `OUTSIDE`, `HOUSE`, and `ROOM`. Let's start these as plain JavaScript objects.

```js
// A state is just a plain javascript object with a name property.
const OUTSIDE = { name: 'OUTSIDE' };
const HOUSE = { name: 'HOUSE' };
const ROOM = { name: 'ROOM' };
```

In some use cases, these simple states might do the trick. In our example we need a bit more complex

```js
// Import madux
import { createStore, createMachine, State } from 'madux';

// Create some states.
const LOBBY = new State('LOBBY');
const ROOM = new State('ROOM');

// Create some Actions.
const ENTER = 'ENTER';
const LEAVE = 'LEAVE';

// Create a machine.
const machine = createMachine([LOBBY, ROOM]);
machine.from(LOBBY).to(ROOM).on(ENTER);
machine.from(ROOM).to(LOBBY).on(LEAVE);

// Create a store.
const store = createStore(machine);

// Subscribe to the store.
store.subscribe((prev, act, next) => {
  console.log(`Welcome to the ${next.name}.`);
});

// Dispatch some actions!
store.dispatch({ type: ENTER }); // Console: `Welcome to the ROOM.`
store.dispatch({ type: LEAVE }); // Console: `Welcome to the LOBBY.`

```

### License

Licensed under **MIT**
