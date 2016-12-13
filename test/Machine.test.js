
// @flow

import chai from 'chai';
import { State } from '../src/State';
import { Machine } from '../src/Machine';

const expect = chai.expect;

describe('Machine', () => {
  const state1 = new State('A', []);
  const state2 = new State('B', []);
  const state3 = new State('C', []);
  const state4 = new State('D', []);
  const trans1 = { type: 'TRANS1', params: {} };
  const trans2 = { type: 'TRANS2', params: {} };
  const trans3 = { type: 'TRANS3', params: {} };
  const trans4 = { type: 'TRANS4', params: {} };
  const trans5 = { type: 'TRANS5', params: {} };

  it('should create propper Machine', () => {
    const machine = new Machine([state1, state2, state3]);
    expect(machine.hasState(state1)).to.equal(true);
    expect(machine.hasState(state2)).to.equal(true);
    expect(machine.hasState(state3)).to.equal(true);
    expect(machine.hasState(state4)).to.equal(false);
    expect(machine.hasStateName(state1.name)).to.equal(true);
    expect(machine.hasStateName(state2.name)).to.equal(true);
    expect(machine.hasStateName(state3.name)).to.equal(true);
    expect(machine.hasStateName(state4.name)).to.equal(false);
  });

  it('should create invalid Machine should fail', () => {
    expect(() => new Machine([])).to.throw();
  });

  it('should work with start() on propper Machine', () => {
    const machine = new Machine([state1, state2, state3]);
    expect(machine.isStarted()).to.equal(false);
    machine.start();
    expect(machine.isStarted()).to.equal(true);
    machine.stop();
    expect(machine.isStarted()).to.equal(false);
  });

  it('should work with from() on propper State from Machine', () => {
    const machine = new Machine([state1, state2, state3]);
    const single = machine.from(state1.name);
    expect(single.start).to.equal(state1.name);
    expect(single.machine).to.equal(machine);
  });

  it('should work with from() on another propper State from Machine', () => {
    const machine = new Machine([state1, state2, state3]);
    const single = machine.from(state3.name);
    expect(single.start).to.equal(state3.name);
    expect(single.machine).to.equal(machine);
  });

  it('should fail with invalid State from Machine', () => {
    const machine = new Machine([state1, state2, state3]);
    expect(() => machine.from(state4.name)).to.throw();
  });

  it('should process transitions correctly', () => {
    const machine = new Machine([state1, state2, state3, state4]);
    machine.from(state1.name).to(state2.name).on(trans1.type);
    machine.from(state2.name).to(state4.name).on(trans2.type);
    machine.from(state4.name).to(state1.name).on(trans3.type);
    machine.from(state1.name).to(state3.name).on(trans4.type);
    machine.from(state3.name).to(state2.name).on(trans5.type);
    machine.start();
    machine.dispatch(trans1);
    machine.dispatch(trans2);
    machine.dispatch(trans3);
    machine.dispatch(trans4);
    machine.dispatch(trans5);
    expect(machine.current).to.equal(state2.name);
  });
});
