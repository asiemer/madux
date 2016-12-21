
// @flow

import chai from 'chai';
import { createMachine } from '../src/Machine';

const expect = chai.expect;

describe('Machine.js', () => {
  describe('Machine', () => {
    describe('Constructor', () => {
      it('should work with valid states', () => {});
      it('fails on invalid states', () => {});
      it('fails without states', () => {});
    });
    describe('Function: stop', () => {
      it('should stop the machine', () => {});
    });
    describe('Function: start', () => {
      it('should start the machine', () => {});
    });
    describe('Function: isStarted', () => {
      it('should return correct value in any case', () => {});
    });
    describe('Function: getCurrentState', () => {
      it('should return correct state', () => {});
      it('should return null when not started', () => {});
    });
  });
});

describe('Machine', () => {
  const state1 = { name: 'A' };
  const state2 = { name: 'B' };
  const state3 = { name: 'C' };
  const state4 = { name: 'D' };
  const state5 = {
    name: 'E',
    props: [{
      name: 'room',
      required: true,
    }],
  };
  const trans1 = { type: 'TRANS1', params: {} };
  const trans2 = { type: 'TRANS2', params: {} };
  const trans3 = { type: 'TRANS3', params: {} };
  const trans4 = { type: 'TRANS4', params: {} };
  const trans5 = { type: 'TRANS5', params: {} };
  const trans6 = { type: 'TRANS1', params: { room: 5 } };

  it('should create propper Machine', () => {
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

  it('should create invalid Machine should fail', () => {
    expect(() => createMachine()).to.throw();
  });

  it('should work with start() on propper Machine', () => {
    const machine = createMachine(state1, state2, state3);
    expect(machine.isStarted()).to.equal(false);
    machine.start();
    expect(machine.isStarted()).to.equal(true);
    machine.stop();
    expect(machine.isStarted()).to.equal(false);
  });

  it('should work with from() on propper State from Machine', () => {
    const machine = createMachine(state1, state2, state3);
    const single = machine.from(state1);
    expect(single.start).to.equal(state1);
    expect(single.machine).to.equal(machine);
  });

  it('should work with from() on another propper State from Machine', () => {
    const machine = createMachine(state1, state2, state3);
    const single = machine.from(state3);
    expect(single.start).to.equal(state3);
    expect(single.machine).to.equal(machine);
  });

  it('should fail with invalid State from Machine', () => {
    const machine = createMachine(state1, state2, state3);
    expect(() => machine.from(state4)).to.throw();
  });

  it('should process transitions correctly', () => {
    const machine = createMachine(state1, state2, state3, state4);
    machine.from(state1).to(state2).on(trans1.type);
    machine.from(state2).to(state4).on(trans2.type);
    machine.from(state4).to(state1).on(trans3.type);
    machine.from(state1).to(state3).on(trans4.type);
    machine.from(state3).to(state2).on(trans5.type);
    machine.start();
    machine.process(trans1);
    machine.process(trans2);
    machine.process(trans3);
    machine.process(trans4);
    machine.process(trans5);
    expect(machine.current).to.equal(state2.name);
  });

  it('should not dispatch without propper params', () => {
    const machine = createMachine(state1, state5);
    machine.from(state1).to(state5).on(trans1.type);
    machine.start();
    expect(machine.canProcess(trans1)).to.equal(false);
    expect(machine.canProcess(trans6)).to.equal(true);
    expect(() => machine.process(trans1)).to.throw();
    expect(machine.current).to.equal(state1.name);
    machine.process(trans6);
    expect(machine.current).to.equal(state5.name);
  });
});
