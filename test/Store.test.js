
// @flow

import chai from 'chai';
import { createMachine } from '../src/Machine';
import type { Action, Dispatch } from '../src/Types';

const expect = chai.expect;

describe('Store', () => {
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

  it('should create propper Store', () => {
    const machine = createMachine(state1, state2, state3);
    expect(machine.isStarted()).to.equal(false);
    const store = machine.buildStore();
    expect(store.machine).to.equal(machine);
    expect(store.machine.isStarted()).to.equal(true);
  });

  it('should return correct getState()', () => {
    const machine = createMachine(state1, state2, state3);
    const store = machine.buildStore();
    expect(store.machine.getCurrentState()).to.equal(state1);
  });

  it('should return correct getState()', () => {
    const machine = createMachine(state1, state2, state3);
    const store = machine.buildStore();
    expect(store.machine.getCurrentState()).to.equal(state1);
  });

  it('should call subscribers correclty', () => {
    const machine = createMachine(state1, state2, state3, state4);
    machine.from(state1).to(state2).on(trans1.type);
    machine.from(state2).to(state4).on(trans2.type);
    machine.from(state4).to(state1).on(trans3.type);
    machine.from(state1).to(state3).on(trans4.type);
    machine.from(state3).to(state2).on(trans5.type);
    const store = machine.buildStore();
    let c1 = 0;
    const uns1 = store.subscribe(() => { c1 += 1; });
    expect(store.nListeners.length).to.equal(1);
    store.dispatch(trans1);
    let c2 = 0;
    const uns2 = store.subscribe(() => { c2 += 1; });
    expect(store.nListeners.length).to.equal(2);
    store.dispatch(trans2);
    store.dispatch(trans3);
    uns2();
    expect(store.nListeners.length).to.equal(1);
    store.dispatch(trans4);
    store.dispatch(trans5);
    uns1();
    expect(store.nListeners.length).to.equal(0);
    expect(c1).to.equal(5);
    expect(c2).to.equal(2);
  });

  it('should dispatch transitions correctly', () => {
    const machine = createMachine(state1, state2, state3, state4);
    machine.from(state1).to(state2).on(trans1.type);
    machine.from(state2).to(state4).on(trans2.type);
    machine.from(state4).to(state1).on(trans3.type);
    machine.from(state1).to(state3).on(trans4.type);
    machine.from(state3).to(state2).on(trans5.type);
    const store = machine.buildStore();
    store.dispatch(trans1);
    store.dispatch(trans2);
    store.dispatch(trans3);
    store.dispatch(trans4);
    store.dispatch(trans5);
    expect(store.machine.getCurrentState()).to.equal(state2);
  });

  it('should not dispatch without propper params', () => {
    const machine = createMachine(state1, state5);
    machine.from(state1).to(state5).on(trans1.type);
    const store = machine.buildStore();
    expect(() => store.dispatch(trans1)).to.throw();
    expect(store.machine.getCurrentState()).to.equal(state1);
    store.dispatch(trans6);
    expect(store.machine.getCurrentState()).to.equal(state5);
  });

  it('should work with middlewares', () => {
    let count = 0;
    const m1 = (next: Dispatch) => (action: Action) => {
      count += 1;
      next(action);
    };
    const m2 = (next: Dispatch) => (action: Action) => {
      count += 2;
      next(action);
    };
    const machine = createMachine(state1, state2, state3, state4);
    machine.from(state1).to(state2).on(trans1.type);
    machine.from(state2).to(state4).on(trans2.type);
    machine.from(state4).to(state1).on(trans3.type);
    machine.from(state1).to(state3).on(trans4.type);
    machine.from(state3).to(state2).on(trans5.type);
    const store = machine.buildStore().bindMiddleware(m1, m2);
    store.dispatch(trans1);
    store.dispatch(trans2);
    store.dispatch(trans3);
    store.dispatch(trans4);
    store.dispatch(trans5);
    expect(store.machine.getCurrentState()).to.equal(state2);
    expect(count).to.equal(15);
  });
});
