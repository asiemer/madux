
# Props in Madux

*This document is only intended for developers at the moment. It's an idea on how the props aspect of madux should be implemented*

As said before, a simple state only needs a name.
```js
const ROOM = { name: 'ROOM' };
```

In most applications, having a state machine consisting of only simple states just won't be enough.
You might not only want to know that the user is in a room, but you also want to know which room.
Let's assume that a room needs a number in order to exist. In that case, we can simply write the
following.

```js
const ROOM = {
  name: 'ROOM',
  props: {
    name: 'number',
    required: true,
  },
};
```
