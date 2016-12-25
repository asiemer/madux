
import chai from 'chai';
import { Machine, createMachine } from '../src/Machine';

const expect = chai.expect;

describe('Machine.js', () => {
  const state1 = { name: 'A' };
  const state2 = { name: 'B' };
  const state3 = { name: 'C' };
  const state4 = { name: 'D' };
  const trans1 = { type: 'TRANS1', params: {} };
  const trans2 = { type: 'TRANS2', params: {} };
  const trans3 = { type: 'TRANS3', params: {} };
  const trans5 = { type: 'TRANS5', params: {} };
  describe('Machine', () => {
    describe('Constructor', () => {
      it('should work with valid states', () => {
        const machine = createMachine(state1, state2, state3);
        expect(machine.hasState(state1)).to.equal(true);
        expect(machine.hasState(state2)).to.equal(true);
        expect(machine.hasState(state3)).to.equal(true);
        expect(machine.hasState(state4)).to.equal(false);
        expect(machine.hasState(state1)).to.equal(true);
        expect(machine.hasState(state2)).to.equal(true);
        expect(machine.hasState(state3)).to.equal(true);
        expect(machine.hasState(state4)).to.equal(false);
      });
      it('fails on invalid states', () => {
        expect(() => createMachine(state1, {})).to.throw();
        expect(() => createMachine({})).to.throw();
      });
      it('fails without states', () => {
        expect(() => createMachine()).to.throw();
      });
    });
    describe('Function: stop', () => {
      it('should stop the machine', () => {
        const machine = createMachine(state1);
        expect(machine.isStarted()).to.equal(false);
        machine.stop();
        expect(machine.isStarted()).to.equal(false);
      });
    });
    describe('Function: start', () => {
      it('should start the machine', () => {
        const machine = createMachine(state1);
        expect(machine.isStarted()).to.equal(false);
        machine.start();
        expect(machine.isStarted()).to.equal(true);
      });
    });
    describe('Function: isStarted', () => {
      it('should return correct value in any case', () => {
        const machine = createMachine(state1);
        expect(machine.isStarted()).to.equal(false);
        machine.stop();
        expect(machine.isStarted()).to.equal(false);
        machine.start();
        expect(machine.isStarted()).to.equal(true);
        machine.stop();
        expect(machine.isStarted()).to.equal(false);
      });
    });
    describe('Function: getCurrentState', () => {
      it('should return correct state', () => {
        const machine = createMachine(state1);
        machine.start();
        expect(machine.getCurrentState()).to.equal(state1);
      });
      it('should return null when not started', () => {
        const machine = createMachine(state1);
        expect(machine.getCurrentState()).to.equal(null);
      });
    });
    describe('Function: lock', () => {
      it('should lock the machine', () => {
        const machine = createMachine(state1);
        expect(machine.isLocked()).to.equal(false);
        machine.lock();
        expect(machine.isLocked()).to.equal(true);
      });
    });
    describe('Function: unlock', () => {
      it('should unlock the machine', () => {
        const machine = createMachine(state1);
        expect(machine.isLocked()).to.equal(false);
        machine.lock();
        expect(machine.isLocked()).to.equal(true);
        machine.unlock();
        expect(machine.isLocked()).to.equal(false);
      });
    });
    describe('Function: isLocked', () => {
      it('should return correct value in any case', () => {
        const machine = createMachine(state1);
        expect(machine.isLocked()).to.equal(false);
        machine.lock();
        expect(machine.isLocked()).to.equal(true);
        machine.unlock();
        expect(machine.isLocked()).to.equal(false);
      });
    });
    describe('Function: hasStateName', () => {
      it('should return false if state is not in machine', () => {
        const machine = createMachine(state1, state2);
        expect(machine.hasStateName(null)).to.equal(false);
        expect(machine.hasStateName(undefined)).to.equal(false);
        expect(machine.hasStateName(state4.name)).to.equal(false);
      });
      it('should return true if state is in machine', () => {
        const machine = createMachine(state1, state2);
        expect(machine.hasStateName(state1.name)).to.equal(true);
        expect(machine.hasStateName(state2.name)).to.equal(true);
      });
    });
    describe('Function: hasState', () => {
      it('should return false if state is not in machine', () => {
        const machine = createMachine(state1, state2);
        expect(machine.hasState(null)).to.equal(false);
        expect(machine.hasState(undefined)).to.equal(false);
        expect(machine.hasState(state4)).to.equal(false);
      });
      it('should return true if state is in machine', () => {
        const machine = createMachine(state1, state2);
        expect(machine.hasState(state1)).to.equal(true);
        expect(machine.hasState(state2)).to.equal(true);
      });
      it('should return true if duplicate state is in machine', () => {
        const machine = createMachine(state1, state2);
        expect(machine.hasState({ name: 'A' })).to.equal(true);
      });
    });
    describe('Function: from', () => {
      it('returns a correct SingleBinder', () => {
        const machine = createMachine(state1, state2);
        const binder = machine.from(state1);
        expect(binder.start).to.equal(state1);
      });
      it('throws on invalid state', () => {
        const machine = createMachine(state1, state2);
        expect(() => machine.from({})).to.throw();
        expect(() => machine.from(undefined)).to.throw();
        expect(() => machine.from(null)).to.throw();
        expect(() => machine.from()).to.throw();
      });
      it('throws on state that is not in machine', () => {
        const machine = createMachine(state1, state2);
        expect(() => machine.from(state4)).to.throw();
      });
    });
    describe('Function: addTransition', () => {
      it('works with valid transition', () => {
        const machine = createMachine(state1, state2);
        machine.addTransition(state1, trans1.type, state2);
        expect(machine.states.get(state1.name).next.get(trans1.type)).to.equal(state2.name);
      });
      it('throws if the transition already exists', () => {
        const machine = createMachine(state1, state2, state3);
        machine.addTransition(state1, trans1.type, state2);
        expect(() => machine.addTransition(state1, trans1.type, state3)).to.throw();
      });
      it('throws when machine is locked', () => {
        const machine = createMachine(state1, state2);
        machine.lock();
        expect(() => machine.addTransition(state1, trans1.type, state2)).to.throw();
      });
      it('throws with invalid states', () => {
        const machine = createMachine(state1, state2, state3);
        machine.addTransition(state1, trans1.type, state2);
        expect(() => machine.addTransition(null, trans1.type, state3)).to.throw();
        expect(() => machine.addTransition(undefined, trans1.type, state3)).to.throw();
        expect(() => machine.addTransition(null, trans1.type, null)).to.throw();
        expect(() => machine.addTransition(null, trans1.type, undefined)).to.throw();
        expect(() => machine.addTransition(state4, trans1.type, state3)).to.throw();
        expect(() => machine.addTransition(state1, trans1.type, state4)).to.throw();
      });
      it('throws with invalid actionType', () => {
        const machine = createMachine(state1, state2, state3);
        machine.addTransition(state1, trans1.type, state2);
        expect(() => machine.addTransition(state1, {}, state2)).to.throw();
        expect(() => machine.addTransition(state1, null, state3)).to.throw();
        expect(() => machine.addTransition(state1, undefined, state2)).to.throw();
      });
    });
    describe('Function: canProcess', () => {
      it('returns true on valid transition', () => {
        const machine = createMachine(state1, state2);
        machine.from(state1).to(state2).on(trans1.type);
        machine.start();
        expect(machine.canProcess(trans1)).to.equal(true);
      });
      it('returns false on invalid transition', () => {
        const machine = createMachine(state1, state2);
        machine.from(state1).to(state2).on(trans1.type);
        machine.start();
        expect(machine.canProcess(trans2)).to.equal(false);
      });
      it('returns false on invalid actionType', () => {
        const machine = createMachine(state1, state2);
        machine.from(state1).to(state2).on(trans1.type);
        machine.start();
        expect(machine.canProcess(trans2)).to.equal(false);
        expect(machine.canProcess({})).to.equal(false);
        expect(machine.canProcess(null)).to.equal(false);
        expect(machine.canProcess(undefined)).to.equal(false);
      });
    });
    describe('Function: process', () => {
      it('updates to correct state', () => {
        const machine = createMachine(state1, state2, state3);
        machine.from(state1).to(state2).on(trans1.type);
        machine.from(state2).to(state3).on(trans2.type);
        machine.from(state3).to(state2).on(trans3.type);
        machine.lock();
        machine.start();
        machine.process(trans1);
        machine.process(trans2);
        machine.process(trans3);
        expect(machine.getCurrentState()).to.equal(state2);
      });
      it('throws when machine is unlocked', () => {
        const machine = createMachine(state1, state2, state3);
        machine.from(state1).to(state2).on(trans1.type);
        machine.from(state2).to(state3).on(trans2.type);
        machine.from(state3).to(state2).on(trans3.type);
        machine.start();
        expect(() => machine.process(trans1)).to.throw();
      });
      it('throws when destination is not found', () => {
        const machine = createMachine(state1, state2, state3);
        machine.from(state1).to(state2).on(trans1.type);
        machine.from(state2).to(state3).on(trans2.type);
        machine.from(state3).to(state2).on(trans3.type);
        machine.lock();
        machine.start();
        expect(() => machine.process(trans5)).to.throw();
      });
    });
    describe('Function: buildStore', () => {
      it('returns a store', () => {
        const machine = createMachine(state1, state2, state3);
        machine.from(state1).to(state2).on(trans1.type);
        machine.from(state2).to(state3).on(trans2.type);
        machine.from(state3).to(state2).on(trans3.type);
        const store = machine.buildStore();
        expect(store.machine).to.equal(machine);
      });
    });
  });
  describe('Creators', () => {
    it('should create Machine', () => {
      const m1 = new Machine(state1, state2);
      const m2 = createMachine(state1, state2);
      expect(m1.initial).to.equal(m2.initial);
    });
  });
});
