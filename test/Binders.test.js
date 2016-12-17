
// @flow

import chai from 'chai';
import { createMachine } from '../src/Machine';
import { createSingleBinder, createDoubleBinder } from '../src/Binders';

const expect = chai.expect;

describe('Binders', () => {
  const state1 = { name: 'A' };
  const state2 = { name: 'B' };
  const state3 = { name: 'C' };

  it('should create propper SingleBound', () => {
    const machine = createMachine(state1, state2, state3);
    const single = createSingleBinder(machine, state1);
    expect(single.start).to.equal(state1);
    expect(single.machine).to.equal(machine);
  });

  it('should create invalid SingleBound should fail', () => {
    const machine = createMachine(state1, state2);
    expect(() => createSingleBinder(machine, state3)).to.throw();
  });

  it('should create propper DoubleBound', () => {
    const machine = createMachine(state1, state2, state3);
    const double = createDoubleBinder(machine, state1, state2);
    expect(double.start).to.equal(state1);
    expect(double.end).to.equal(state2);
    expect(double.machine).to.equal(machine);
  });

  it('should create propper DoubleBound', () => {
    const machine = createMachine(state1, state2, state3);
    const double = createSingleBinder(machine, state1).to(state2);
    expect(double.start).to.equal(state1);
    expect(double.end).to.equal(state2);
    expect(double.machine).to.equal(machine);
  });

  it('should create invalid DoubleBound should fail on first', () => {
    const machine = createMachine(state1, state2);
    expect(() => createDoubleBinder(machine, state3, state1)).to.throw();
  });

  it('should create invalid DoubleBound should fail on second', () => {
    const machine = createMachine(state1, state2);
    expect(() => createDoubleBinder(machine, state1, state3)).to.throw();
  });
});
