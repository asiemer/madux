
<p align="center">
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


[Madux](https://github.com/Jense5/madux) uses a finite state machine to hold track of the state of your NodeJS or JavaScript application. It can be used in a variety of ways, without

[Madux](https://github.com/Jense5/madux) is a predictable state container for command line tools written in JS. It can be seen as an alternative to [Redux](https://github.com/reactjs/redux), although it requires a different way of thinking about the state of the app. In Madux, the state of the app is represented as a finite [state machine](https://en.wikipedia.org/wiki/Finite-state_machine).

Although Madux can be used on its own, it's strongly advised to use it in combination with [madux-bind](https://github.com/Jense5/madux-bind). It makes it possible to build a JS app in a declarative way which makes it easier to create a consistent and bug-free application. You can find a hands-on tutorial [here](https://jense5.gitbooks.io/madux/content/).


### Experience

Make sure you understand the fundamentals of state machines, as well as how a predictable state container works, before deciding if you should use madux and madux-bind. It has helped me a lot in the past, although it's not the best solution for every project. The [documentation](https://jense5.gitbooks.io/madux/content/) should make clear if madux is a good option for your app or not.

### Basic Madux Example

<p align="center">
  <img src="http://i.imgur.com/Jdehzch.png" />
</p>
You can install that latest stable version within your project with npm or yarn. Madux looks a lot like Redux in this basic example, but will differ more when we expand it to a [real cli tool](https://jense5.gitbooks.io/madux/content/). For more details, check the [docs](https://jense5.gitbooks.io/madux/content/).

```
$ yarn add madux
```

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
