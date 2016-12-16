
// @flow

import { createMachine, createState } from '../src/Madux';

describe('Binder', () => {
  const LOCKED = createState('LOCKED');
  const UNLOCKED = createState('UNLOCKED');
  const LOCK = 'LOCK';
  const UNLOCK = 'UNLOCK';

  it('should work with basic use case', () => {
    const machine = createMachine([UNLOCKED, LOCKED]);
    machine.from(LOCKED).to(UNLOCKED).on(UNLOCK);
    machine.from(UNLOCKED).to(LOCKED).on(LOCK);
  });
});
