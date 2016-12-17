
# Contributing: Todos

### Version 0.2.0
- [ ] When Madux-bind is finished
- [ ] All tests are implemented
- [ ] Add documentation (with jsdoc)
- [ ] Update readme with experiment notice

### Version 0.1.9
- [ ] State vs Action brainstorm
- [ ] Store vs Machine brainstorm
- [ ] New internal structure for transition
- [ ] Export static functions to a Util file
- [ ] Think about test scenarios and skip them...

### Future use...

```js

import { createMachine } from 'madux';

const machine = createMachine(STRANGER, LOBBY, ROOM)
machine.from(STRANGER).to(LOBBY).on(SIGNIN);

export store = machine.buildStore().bindMiddlewares(maduxBind);

```
