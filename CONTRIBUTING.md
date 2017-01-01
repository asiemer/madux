
# Contributing: Todos

### Version 0.2.0
- [ ] When Madux-bind is finished
- [ ] Add documentation (with jsdoc)

### Version 0.1.9
- [x] State vs Action brainstorm
- [x] Store vs Machine brainstorm
- [x] New internal structure for transition
- [x] Export static functions to a Util file
- [x] Complete tests
- [ ] Add scenario tests
- [ ] Update readme with new example
- [ ] Update readme with experiment notice
- [ ] Fix the properties aspect of states
- [ ] More detailed errors if canDispatch is false...

### Future use...

```js

import { createMachine } from 'madux';

const NAMES = {
  ROOM: 'ROOM',
  LOBBY: 'LOBBY',
  STRANGER: 'STRANGER',
};

export const STRANGER = { name: NAMES.STRANGER };

export const LOBBY = { name: NAMES.LOBBY };

export const ROOM = {
  name: NAMES.ROOM,
  props: {
    name: 'number',
    required: true,
    remember: [ NAMES.ROOM ],
  },
};

const machine = createMachine(STRANGER, LOBBY, ROOM)
machine.from(STRANGER).to(LOBBY).on(SIGNIN);

export store = machine.buildStore().bindMiddlewares(maduxBind);

```
