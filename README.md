
# <img src="https://raw.githubusercontent.com/Jense5/states/master/logo/madux.png?token=AFuPa__IRVUtR1O2SsaOzd9GlhxL6V9sks5YWVn5wA%3D%3D" width="250" />

A predictable state container based on [Redux]() ideas with build-in state machine.

Redux is great, but it is not a solution for every project. When it comes down to creating less complex user interfaces, you probably do not need redux at all. When the user interface is not that complex, you might want to think more about it as an advanced predefined state machine. That's where [Madux]() kicks in.

Although it uses a lot of strategies that are used in [Redux](), it requires you to think somewhat different about the state of your project. For a simple hands-on tutorial, take a look at the docs.

<img src="https://img.shields.io/badge/status-development-16a085.svg">
<img src="https://img.shields.io/badge/npm-pending-blue.svg">
<img src="https://img.shields.io/badge/build-pending-orange.svg">

### Experience

I have seen a lot of developers forcing themselves to work with libraries like [redux](). However, as the creators wrote themselves, you [might not need it](). It is important to be constantly thinking about what you are doing and not just use libraries because other developers are using them.

An example of a small tool I wrote if [fb-term-chat](). A small command line tool that uses [Madux]() to keep a consistent state and makes it very easy to maintain.

### Basic example

You can install that latest stable version within your project with npm or yarn. [Madux]() looks a lot like [Redux]() in this basic example, but will differ a lot when we [expand this example to a real life application](). For all the details, check the [documentation]().

```
$ yarn add madux
```

```js
import { createStore, Machine } from 'madux';

const machine = new Machine('LOBBY', 'ROOM');
machine.from('LOBBY').to('ROOM').on('ENTER');
machine.from('ROOM').to('LOBBY').on('LEAVE');

const store = createStore(machine);

store.subscribe((prev, act, next) => {
  console.log(`Welcome to ${next}`);
});

store.dispatch({ type: 'ENTER' });
store.dispatch({ type: 'LEAVE' });

```

### License

Licensed under MIT
