
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
    const machine = new Machine([state1, state2, state3]);
    const single = new SingleBound(machine, state1);
    expect(single.start).to.equal(state1);
    expect(single.machine).to.equal(machine);
  });

  it('should create invalid SingleBound should fail', () => {
    const machine = new Machine([state1, state2]);
    expect(() => new SingleBound(machine, state3)).to.throw();
  });

  it('should create propper DoubleBound', () => {
    const machine = new Machine([state1, state2, state3]);
    const double = new DoubleBound(machine, state1, state2);
    expect(double.start).to.equal(state1);
    expect(double.end).to.equal(state2);
    expect(double.machine).to.equal(machine);
  });

  it('should create propper DoubleBound', () => {
    const machine = new Machine([state1, state2, state3]);
    const double = new SingleBound(machine, state1).to(state2);
    expect(double.start).to.equal(state1);
    expect(double.end).to.equal(state2);
    expect(double.machine).to.equal(machine);
  });

  it('should create invalid DoubleBound should fail on first', () => {
    const machine = new Machine([state1, state2]);
    expect(() => new DoubleBound(machine, state3, state1)).to.throw();
  });

  it('should create invalid DoubleBound should fail on second', () => {
    const machine = new Machine([state1, state2]);
    expect(() => new DoubleBound(machine, state1, state3)).to.throw();
  });

  it('should create propper FullBound', () => {
    const machine = new Machine([state1, state2, state3]);
    const double = new FullBound(machine, state1, state2, transition);
    expect(double.start).to.equal(state1);
    expect(double.end).to.equal(state2);
    expect(double.actionType).to.equal(transition);
    expect(double.machine).to.equal(machine);
    const maps = machine.structure.get(state1.name);
    expect(!!maps).to.equal(true);
    if (maps) { expect(maps.has(transition)).to.equal(true); }
    if (maps) { expect(maps.get(transition)).to.equal(state2.name); }
  });

  it('should create propper FullBound', () => {
    const machine = new Machine([state1, state2, state3]);
    const double = new DoubleBound(machine, state1, state2).on(transition);
    expect(double.start).to.equal(state1);
    expect(double.end).to.equal(state2);
    expect(double.actionType).to.equal(transition);
    expect(double.machine).to.equal(machine);
    const maps = machine.structure.get(state1.name);
    expect(!!maps).to.equal(true);
    if (maps) { expect(maps.has(transition)).to.equal(true); }
    if (maps) { expect(maps.get(transition)).to.equal(state2.name); }
  });

  it('should create invalid FullBound should fail on first', () => {
    const machine = new Machine([state1, state2]);
    expect(() => new FullBound(machine, state3, state1, transition)).to.throw();
  });

  it('should create invalid FullBound should fail on second', () => {
    const machine = new Machine([state1, state2]);
    expect(() => new FullBound(machine, state1, state3, transition)).to.throw();
  });
});
