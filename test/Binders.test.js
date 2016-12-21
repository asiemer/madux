
import chai from 'chai';
import { createMachine } from '../src/Machine';
import {
  SingleBinder,
  DoubleBinder,
  createSingleBinder,
  createDoubleBinder,
} from '../src/Binders';

const expect = chai.expect;

describe('Binders.js', () => {
  const state1 = { name: 'A' };
  const state2 = { name: 'B' };
  const state3 = { name: 'C' };
  describe('DoubleBinder', () => {
    describe('Constructor', () => {
      it('creates a normal DoubleBinder with valid info', () => {
        const machine = createMachine(state1, state2, state3);
        const double12 = createDoubleBinder(machine, state1, state2);
        const double13 = createDoubleBinder(machine, state1, state3);
        const double22 = createDoubleBinder(machine, state2, state2);
        expect(double12.start).to.equal(state1);
        expect(double12.end).to.equal(state2);
        expect(double13.start).to.equal(state1);
        expect(double13.end).to.equal(state3);
        expect(double22.start).to.equal(state2);
        expect(double22.start).to.equal(double22.end);
        expect(double12.machine).to.equal(machine);
        expect(double13.machine).to.equal(machine);
        expect(double22.machine).to.equal(machine);
      });
      it('fails with invalid start State for DoubleBinder', () => {
        const machine = createMachine(state1, state2);
        expect(() => createDoubleBinder(machine, state3, state1)).to.throw();
        expect(() => createDoubleBinder(machine, state3, state2)).to.throw();
      });
      it('fails with invalid end State for DoubleBinder', () => {
        const machine = createMachine(state1, state2);
        expect(() => createDoubleBinder(machine, state1, state3)).to.throw();
        expect(() => createDoubleBinder(machine, state2, state3)).to.throw();
      });
      it('fails with some param null or undefined', () => {
        const machine = createMachine(state1, state2);
        expect(() => createDoubleBinder(null, state1, state2)).to.throw();
        expect(() => createDoubleBinder(undefined, state1, state2)).to.throw();
        expect(() => createDoubleBinder(machine, null, state2)).to.throw();
        expect(() => createDoubleBinder(machine, undefined, state2)).to.throw();
        expect(() => createDoubleBinder(machine, state1, null)).to.throw();
        expect(() => createDoubleBinder(machine, state1, undefined)).to.throw();
      });
      it('reports correctly if machine is invalid', () => {
        expect(() => createDoubleBinder({}, state1, state2)).to.throw();
        expect(() => createDoubleBinder(null, state1, state2)).to.throw();
        expect(() => createDoubleBinder(undefined, state1, state2)).to.throw();
      });
    });
    describe('Function: on', () => {
      it('works with valid actions', () => {
        const machine = createMachine(state1, state2, state3);
        const double12 = createDoubleBinder(machine, state1, state2);
        double12.on('VALID');
        double12.on('ANOTHER', 'VALIDONE');
      });
      it('works without actions', () => {
        const machine = createMachine(state1, state2, state3);
        const double12 = createDoubleBinder(machine, state1, state2);
        double12.on();
      });
      it('fails with invalid actions', () => {
        const machine = createMachine(state1, state2, state3);
        const double12 = createDoubleBinder(machine, state1, state2);
        expect(() => double12.on('')).to.throw();
        expect(() => double12.on(null)).to.throw();
        expect(() => double12.on(undefined)).to.throw();
      });
    });
  });

  describe('SingleBinder', () => {
    describe('Constructor', () => {
      it('creates a normal SingleBinder with valid info', () => {
        const machine = createMachine(state1, state2, state3);
        const single1 = createSingleBinder(machine, state1);
        const single2 = createSingleBinder(machine, state2);
        const single3 = createSingleBinder(machine, state3);
        expect(single1.start).to.equal(state1);
        expect(single2.start).to.equal(state2);
        expect(single3.start).to.equal(state3);
        expect(single1.machine).to.equal(machine);
        expect(single2.machine).to.equal(machine);
        expect(single3.machine).to.equal(machine);
      });
      it('fails with invalid start State for SingleBinder', () => {
        const machine = createMachine(state1, state2);
        const single1 = createSingleBinder(machine, state1);
        expect(single1.start).to.equal(state1);
        expect(() => createSingleBinder(machine, state3)).to.throw();
      });
      it('fails with some param null or undefined', () => {
        const machine = createMachine(state1, state2);
        expect(() => createSingleBinder(null, state1)).to.throw();
        expect(() => createSingleBinder(undefined, state1)).to.throw();
        expect(() => createSingleBinder(machine, null)).to.throw();
        expect(() => createSingleBinder(machine, undefined)).to.throw();
      });
      it('reports correctly if machine is invalid', () => {
        expect(() => createSingleBinder({}, state1)).to.throw();
        expect(() => createSingleBinder(null, state1)).to.throw();
        expect(() => createSingleBinder(undefined, state1)).to.throw();
      });
    });
    describe('Function: to', () => {
      it('works with valid state', () => {
        const machine = createMachine(state1, state2, state3);
        const double1 = createSingleBinder(machine, state1).to(state1);
        const double2 = createSingleBinder(machine, state1).to(state2);
        const double3 = createSingleBinder(machine, state1).to(state3);
        expect(double1.start).to.equal(state1);
        expect(double1.start).to.equal(double1.end);
        expect(double2.start).to.equal(state1);
        expect(double2.end).to.equal(state2);
        expect(double3.start).to.equal(state1);
        expect(double3.end).to.equal(state3);
        expect(double1.machine).to.equal(machine);
        expect(double2.machine).to.equal(machine);
        expect(double3.machine).to.equal(machine);
      });
      it('fails without state', () => {
        const machine = createMachine(state1, state2, state3);
        const single = createSingleBinder(machine, state1);
        expect(() => single.to()).to.throw();
      });
      it('fails with invalid state', () => {
        const machine = createMachine(state1, state2);
        const single = createSingleBinder(machine, state1);
        expect(() => single.to(state2)).to.not.throw();
        expect(() => single.to(null)).to.throw();
        expect(() => single.to(undefined)).to.throw();
        expect(() => single.to(state3)).to.throw();
      });
    });
  });

  describe('Creators', () => {
    it('should create DoubleBinder', () => {
      const machine = createMachine(state1, state2);
      const raw = new DoubleBinder(machine, state1, state2);
      const cre = createDoubleBinder(machine, state1, state2);
      expect(raw.end).to.equal(raw.end);
      expect(raw.start).to.equal(cre.start);
      expect(raw.machine).to.equal(raw.machine);
    });
    it('should create SingleBinder', () => {
      const machine = createMachine(state1, state2);
      const raw = new SingleBinder(machine, state1);
      const cre = createSingleBinder(machine, state1);
      expect(raw.start).to.equal(cre.start);
      expect(raw.machine).to.equal(raw.machine);
    });
  });
});
