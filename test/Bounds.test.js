
// @flow

import chai from 'chai';
import { State } from '../src/State';
import { Machine } from '../src/Machine';
import { SingleBound, DoubleBound, FullBound } from '../src/Bounds';

const expect = chai.expect;

describe('Bounds', () => {
  const state1 = new State('A', []);
  const state2 = new State('B', []);
  const state3 = new State('C', []);
  const transition = 'T';

  it('should create propper SingleBound', () => {
    const machine = new Machine(new Set([state1, state2, state3]));
    const single = new SingleBound(machine, state1.name);
    expect(single.start).to.equal(state1.name);
    expect(single.machine).to.equal(machine);
  });

  it('should create invalid SingleBound should fail', () => {
    const machine = new Machine(new Set([state1, state2]));
    expect(() => new SingleBound(machine, state3.name)).to.throw();
  });

  it('should create propper DoubleBound', () => {
    const machine = new Machine(new Set([state1, state2, state3]));
    const double = new DoubleBound(machine, state1.name, state2.name);
    expect(double.start).to.equal(state1.name);
    expect(double.stop).to.equal(state2.name);
    expect(double.machine).to.equal(machine);
  });

  it('should create propper DoubleBound', () => {
    const machine = new Machine(new Set([state1, state2, state3]));
    const double = new SingleBound(machine, state1.name).to(state2.name);
    expect(double.start).to.equal(state1.name);
    expect(double.stop).to.equal(state2.name);
    expect(double.machine).to.equal(machine);
  });

  it('should create invalid DoubleBound should fail on first', () => {
    const machine = new Machine(new Set([state1, state2]));
    expect(() => new DoubleBound(machine, state3.name, state1.name)).to.throw();
  });

  it('should create invalid DoubleBound should fail on second', () => {
    const machine = new Machine(new Set([state1, state2]));
    expect(() => new DoubleBound(machine, state1.name, state3.name)).to.throw();
  });

  it('should create propper FullBound', () => {
    const machine = new Machine(new Set([state1, state2, state3]));
    const double = new FullBound(machine, state1.name, state2.name, transition);
    expect(double.start).to.equal(state1.name);
    expect(double.stop).to.equal(state2.name);
    expect(double.trigger).to.equal(transition);
    expect(double.machine).to.equal(machine);
  });

  it('should create propper FullBound', () => {
    const machine = new Machine(new Set([state1, state2, state3]));
    const double = new DoubleBound(machine, state1.name, state2.name).on(transition);
    expect(double.start).to.equal(state1.name);
    expect(double.stop).to.equal(state2.name);
    expect(double.trigger).to.equal(transition);
    expect(double.machine).to.equal(machine);
  });

  it('should create invalid FullBound should fail on first', () => {
    const machine = new Machine(new Set([state1, state2]));
    expect(() => new FullBound(machine, state3.name, state1.name, transition)).to.throw();
  });

  it('should create invalid FullBound should fail on second', () => {
    const machine = new Machine(new Set([state1, state2]));
    expect(() => new FullBound(machine, state1.name, state3.name, transition)).to.throw();
  });
});
