
import chai from 'chai';
import { Machine, createMachine } from '../src/Machine';

const expect = chai.expect;

describe('Machine.js', () => {
  const state1 = { name: 'A' };
  const state2 = { name: 'B' };
  const state3 = { name: 'C' };
  const state4 = { name: 'D' };
  const state5 = {
    name: 'E',
    props: [{
      name: 'number',
      required: false,
      merge: false,
    }, {
      name: 'name',
      required: true,
      merge: true,
    }],
  };
  const trans1 = { type: 'TRANS1', params: {} };
  const trans2 = { type: 'TRANS2', params: {} };
  const trans3 = { type: 'TRANS3', params: {} };
  const trans5 = { type: 'TRANS5', params: {} };
  const trans6 = { type: 'TRANS6', params: { name: 'Joe' } };
  describe('Creators', () => {
    it('should create Machine', () => {
      const m1 = new Machine(state1, state2);
      const m2 = createMachine(state1, state2);
      expect(m1.initial).to.equal(m2.initial);
    });
  });
  describe('Machine', () => {
    it('creates a Machine with valid states', () => {
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
    it('fails to create a Machine with one or more invalid states', () => {
      expect(() => createMachine(state1, {})).to.throw();
      expect(() => createMachine({})).to.throw();
    });
    it('fails to create a Machine without states', () => {
      expect(() => createMachine()).to.throw();
    });
    it('correctly stops the machine', () => {
      const machine = createMachine(state1);
      expect(machine.isStarted()).to.equal(false);
      machine.stop();
      expect(machine.isStarted()).to.equal(false);
    });
    it('correctly starts the machine', () => {
      const machine = createMachine(state1);
      expect(machine.isStarted()).to.equal(false);
      machine.start();
      expect(machine.isStarted()).to.equal(true);
    });
    it('returns correct isStarted value in any case', () => {
      const machine = createMachine(state1);
      expect(machine.isStarted()).to.equal(false);
      machine.stop();
      expect(machine.isStarted()).to.equal(false);
      machine.start();
      expect(machine.isStarted()).to.equal(true);
      machine.stop();
      expect(machine.isStarted()).to.equal(false);
    });
    it('returns correct formatted props', () => {
      const machine = createMachine(state1);
      machine.props = [{
        name: 'number',
        value: 5,
        merge: true,
      }, {
        name: 'person',
        value: 'Joe',
        merge: true,
      }];
      const props = machine.getProps();
      expect(JSON.stringify(props)).to.equal('{"number":5,"person":"Joe"}');
    });
    it('returns correct formatted props to merge', () => {
      const machine = createMachine(state1);
      machine.props = [{
        name: 'number',
        value: 5,
        merge: true,
      }, {
        name: 'person',
        value: 'Joe',
        merge: false,
      }];
      const props = machine.getPropsToMerge();
      expect(JSON.stringify(props)).to.equal('{"number":5}');
    });
    it('merges params and options to merge correcly', () => {
      const machine = createMachine(state1);
      machine.props = [{
        name: 'number',
        value: 5,
        merge: true,
      }, {
        name: 'person',
        value: 'Joe',
        merge: false,
      }];
      const action = machine.getMergedProps(trans6);
      expect(JSON.stringify(action)).to.equal('{"number":5,"name":"Joe"}');
    });
    it('creates correct duplicate action with merged props', () => {
      const machine = createMachine(state1);
      machine.props = [{
        name: 'number',
        value: 5,
        merge: true,
      }, {
        name: 'person',
        value: 'Joe',
        merge: false,
      }];
      const action = machine.updateActionParameters(trans6);
      expect(JSON.stringify(action)).to.equal('{"type":"TRANS6","params":{"number":5,"name":"Joe"}}');
    });
    it('parses correct props for current state', () => {
      const machine = createMachine(state1, state5);
      machine.from(state1).to(state5).on(trans6.type);
      machine.lock();
      machine.start();
      machine.process(trans6);
      const merged = machine.updateActionParameters(trans6);
      const props = machine.parseOptionsForCurrentState(merged.params);
      expect(JSON.stringify(props)).to.equal('[{"name":"number","merge":false},{"name":"name","merge":true,"value":"Joe"}]');
    });
    it('returns correct current state', () => {
      const machine = createMachine(state1);
      machine.start();
      expect(machine.getCurrentState()).to.equal(state1);
    });
    it('returns null as curret state when not started', () => {
      const machine = createMachine(state1);
      expect(machine.getCurrentState()).to.equal(null);
    });
    it('locks the machine', () => {
      const machine = createMachine(state1);
      expect(machine.isLocked()).to.equal(false);
      machine.lock();
      expect(machine.isLocked()).to.equal(true);
    });
    it('unlocks the machine', () => {
      const machine = createMachine(state1);
      expect(machine.isLocked()).to.equal(false);
      machine.lock();
      expect(machine.isLocked()).to.equal(true);
      machine.unlock();
      expect(machine.isLocked()).to.equal(false);
    });
    it('returns correct isLocked value in any case', () => {
      const machine = createMachine(state1);
      expect(machine.isLocked()).to.equal(false);
      machine.lock();
      expect(machine.isLocked()).to.equal(true);
      machine.unlock();
      expect(machine.isLocked()).to.equal(false);
    });
    it('returns false from hasStateName if state is not in machine', () => {
      const machine = createMachine(state1, state2);
      expect(machine.hasStateName(null)).to.equal(false);
      expect(machine.hasStateName(undefined)).to.equal(false);
      expect(machine.hasStateName(state4.name)).to.equal(false);
    });
    it('returns true from hasStateName if state is in machine', () => {
      const machine = createMachine(state1, state2);
      expect(machine.hasStateName(state1.name)).to.equal(true);
      expect(machine.hasStateName(state2.name)).to.equal(true);
    });
    it('returns false from hasState if state is not in machine', () => {
      const machine = createMachine(state1, state2);
      expect(machine.hasState(null)).to.equal(false);
      expect(machine.hasState(undefined)).to.equal(false);
      expect(machine.hasState(state4)).to.equal(false);
    });
    it('returns true from hasState if state is in machine', () => {
      const machine = createMachine(state1, state2);
      expect(machine.hasState(state1)).to.equal(true);
      expect(machine.hasState(state2)).to.equal(true);
    });
    it('returns true from hasState if duplicate state is in machine', () => {
      const machine = createMachine(state1, state2);
      expect(machine.hasState({ name: 'A' })).to.equal(true);
    });
    it('creates a correct SingleBinder', () => {
      const machine = createMachine(state1, state2);
      const binder = machine.from(state1);
      expect(binder.start).to.equal(state1);
    });
    it('throws error on invalid state for SingleBinder', () => {
      const machine = createMachine(state1, state2);
      expect(() => machine.from({})).to.throw();
      expect(() => machine.from(undefined)).to.throw();
      expect(() => machine.from(null)).to.throw();
      expect(() => machine.from()).to.throw();
    });
    it('throws error on state for SingleBinder that is not in machine', () => {
      const machine = createMachine(state1, state2);
      expect(() => machine.from(state4)).to.throw();
    });
    it('creates transition with valid transition', () => {
      const machine = createMachine(state1, state2);
      machine.addTransition(state1, trans1.type, state2);
      expect(machine.states.get(state1.name).next.get(trans1.type)).to.equal(state2.name);
    });
    it('throws error if the transition already exists', () => {
      const machine = createMachine(state1, state2, state3);
      machine.addTransition(state1, trans1.type, state2);
      expect(() => machine.addTransition(state1, trans1.type, state3)).to.throw();
    });
    it('throws error when creating a transition if the machine is locked', () => {
      const machine = createMachine(state1, state2);
      machine.lock();
      expect(() => machine.addTransition(state1, trans1.type, state2)).to.throw();
    });
    it('throws error when creating a transition with invalid states', () => {
      const machine = createMachine(state1, state2, state3);
      machine.addTransition(state1, trans1.type, state2);
      expect(() => machine.addTransition(null, trans1.type, state3)).to.throw();
      expect(() => machine.addTransition(undefined, trans1.type, state3)).to.throw();
      expect(() => machine.addTransition(null, trans1.type, null)).to.throw();
      expect(() => machine.addTransition(null, trans1.type, undefined)).to.throw();
      expect(() => machine.addTransition(state4, trans1.type, state3)).to.throw();
      expect(() => machine.addTransition(state1, trans1.type, state4)).to.throw();
    });
    it('throws error with invalid actionType for transition', () => {
      const machine = createMachine(state1, state2, state3);
      machine.addTransition(state1, trans1.type, state2);
      expect(() => machine.addTransition(state1, {}, state2)).to.throw();
      expect(() => machine.addTransition(state1, null, state3)).to.throw();
      expect(() => machine.addTransition(state1, undefined, state2)).to.throw();
    });
    it('returns true for canProcess on valid transition', () => {
      const machine = createMachine(state1, state2);
      machine.from(state1).to(state2).on(trans1.type);
      machine.start();
      expect(machine.canProcess(trans1)).to.equal(true);
    });
    it('returns false for canProcess on invalid transition', () => {
      const machine = createMachine(state1, state2);
      machine.from(state1).to(state2).on(trans1.type);
      machine.start();
      expect(machine.canProcess(trans2)).to.equal(false);
    });
    it('returns false for canProcess on invalid actionType', () => {
      const machine = createMachine(state1, state2);
      machine.from(state1).to(state2).on(trans1.type);
      machine.start();
      expect(machine.canProcess(trans2)).to.equal(false);
      expect(machine.canProcess({})).to.equal(false);
      expect(machine.canProcess(null)).to.equal(false);
      expect(machine.canProcess(undefined)).to.equal(false);
    });
    it('updates to correct state after process', () => {
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
    it('throws error when machine is unlocked while processing', () => {
      const machine = createMachine(state1, state2, state3);
      machine.from(state1).to(state2).on(trans1.type);
      machine.from(state2).to(state3).on(trans2.type);
      machine.from(state3).to(state2).on(trans3.type);
      machine.start();
      expect(() => machine.process(trans1)).to.throw();
    });
    it('throws error when destination is not found while processing', () => {
      const machine = createMachine(state1, state2, state3);
      machine.from(state1).to(state2).on(trans1.type);
      machine.from(state2).to(state3).on(trans2.type);
      machine.from(state3).to(state2).on(trans3.type);
      machine.lock();
      machine.start();
      expect(() => machine.process(trans5)).to.throw();
    });
    it('creates a valid store', () => {
      const machine = createMachine(state1, state2, state3);
      machine.from(state1).to(state2).on(trans1.type);
      machine.from(state2).to(state3).on(trans2.type);
      machine.from(state3).to(state2).on(trans3.type);
      const store = machine.buildStore();
      expect(store.machine).to.equal(machine);
    });
  });
});
