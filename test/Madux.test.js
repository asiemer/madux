
// @flow

import { createMachine } from '../src/Madux';

describe('Madux.js', () => {
  const LOCKED = { name: 'LOCKED' };
  const UNLOCKED = { name: 'UNLOCKED' };
  const LOCK = 'LOCK';
  const UNLOCK = 'UNLOCK';
  describe('Main', () => {
    it('should work with basic use case', () => {
      const machine = createMachine(UNLOCKED, LOCKED);
      machine.from(LOCKED).to(UNLOCKED).on(UNLOCK);
      machine.from(UNLOCKED).to(LOCKED).on(LOCK);
      machine.buildStore();
    });
  });
});
