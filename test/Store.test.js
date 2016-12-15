
// @flow

import chai from 'chai';
import { Store } from '../src/Store';
import { State } from '../src/State';
import { Machine } from '../src/Machine';
import type { Action, Dispatch } from '../src/Types';

const expect = chai.expect;

describe('Store', () => {
  const state1 = new State('A', []);
  const state2 = new State('B', []);
  const state3 = new State('C', []);
  const state4 = new State('D', []);
  const state5 = new State('E', [{
    name: 'room',
    required: true,
  }]);
  const trans1 = { type: 'TRANS1', params: {} };
  const trans2 = { type: 'TRANS2', params: {} };
  const trans3 = { type: 'TRANS3', params: {} };
  const trans4 = { type: 'TRANS4', params: {} };
  const trans5 = { type: 'TRANS5', params: {} };
  const trans6 = { type: 'TRANS1', params: { room: 5 } };

  it('should create propper Store', () => {
    const machine = new Machine([state1, state2, state3]);
    expect(machine.isStarted()).to.equal(false);
    const store = new Store(machine);
    expect(store.machine).to.equal(machine);
    expect(store.machine.isStarted()).to.equal(true);
  });

  it('should return correct getState()', () => {
    const machine = new Machine([state1, state2, state3]);
    const store = new Store(machine);
    expect(store.getState()).to.equal(state1);
  });

  it('should return correct getState()', () => {
    const machine = new Machine([state1, state2, state3]);
    const store = new Store(machine);
    expect(store.getState()).to.equal(state1);
  });

  it('should call subscribers correclty', () => {
    const machine = new Machine([state1, state2, state3, state4]);
    machine.from(state1.name).to(state2.name).on(trans1.type);
    machine.from(state2.name).to(state4.name).on(trans2.type);
    machine.from(state4.name).to(state1.name).on(trans3.type);
    machine.from(state1.name).to(state3.name).on(trans4.type);
    machine.from(state3.name).to(state2.name).on(trans5.type);
    const store = new Store(machine);
    let c1 = 0;
    const uns1 = store.subscribe(() => { c1 += 1; });
    expect(store.nextListeners.length).to.equal(1);
    store.dispatch(trans1);
    let c2 = 0;
    const uns2 = store.subscribe(() => { c2 += 1; });
    expect(store.nextListeners.length).to.equal(2);
    store.dispatch(trans2);
    store.dispatch(trans3);
    uns2();
    expect(store.nextListeners.length).to.equal(1);
    store.dispatch(trans4);
    store.dispatch(trans5);
    uns1();
    expect(store.nextListeners.length).to.equal(0);
    expect(c1).to.equal(5);
    expect(c2).to.equal(2);
  });

  it('should dispatch transitions correctly', () => {
    const machine = new Machine([state1, state2, state3, state4]);
    machine.from(state1.name).to(state2.name).on(trans1.type);
    machine.from(state2.name).to(state4.name).on(trans2.type);
    machine.from(state4.name).to(state1.name).on(trans3.type);
    machine.from(state1.name).to(state3.name).on(trans4.type);
    machine.from(state3.name).to(state2.name).on(trans5.type);
    const store = new Store(machine);
    store.dispatch(trans1);
    store.dispatch(trans2);
    store.dispatch(trans3);
    store.dispatch(trans4);
    store.dispatch(trans5);
    expect(store.getState()).to.equal(state2);
  });

  it('should not dispatch without propper params', () => {
    const machine = new Machine([state1, state5]);
    machine.from(state1.name).to(state5.name).on(trans1.type);
    const store = new Store(machine);
    store.dispatch(trans1);
    expect(store.getState()).to.equal(state1);
    store.dispatch(trans6);
    expect(store.getState()).to.equal(state5);
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
    const machine = new Machine([state1, state2, state3, state4]);
    machine.from(state1.name).to(state2.name).on(trans1.type);
    machine.from(state2.name).to(state4.name).on(trans2.type);
    machine.from(state4.name).to(state1.name).on(trans3.type);
    machine.from(state1.name).to(state3.name).on(trans4.type);
    machine.from(state3.name).to(state2.name).on(trans5.type);
    const store = new Store(machine, [m1, m2]);
    store.dispatch(trans1);
    store.dispatch(trans2);
    store.dispatch(trans3);
    store.dispatch(trans4);
    store.dispatch(trans5);
    expect(store.getState()).to.equal(state2);
    expect(count).to.equal(15);
  });
});
