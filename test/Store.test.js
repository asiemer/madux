
// @flow

import chai from 'chai';
import { Store, createStore } from '../src/Store';
import { createMachine } from '../src/Machine';
import type { Action, Dispatch } from '../src/Types';

const expect = chai.expect;

describe('Store.js', () => {
  const state1 = { name: 'A' };
  const state2 = { name: 'B' };
  const state3 = { name: 'C' };
  const trans1 = { type: 'TRANS1', params: {} };
  const trans2 = { type: 'TRANS2', params: {} };
  const machine = createMachine(state1, state2, state3);
  machine.from(state1).to(state2).on(trans1.type);
  machine.from(state2).to(state3).on(trans2.type);
  describe('Creators', () => {
    it('should create store', () => {
      const storeA = new Store(machine);
      const storeB = createStore(machine);
      expect(storeA.machine).to.equal(machine);
      expect(storeB.machine).to.equal(machine);
    });
  });
  describe('Store', () => {
    it('creates a store with valid machine', () => {
      machine.unlock();
      machine.current = null;
      expect(machine.isLocked()).to.equal(false);
      expect(machine.isStarted()).to.equal(false);
      const store = new Store(machine);
      expect(store.machine).to.equal(machine);
      expect(machine.isLocked()).to.equal(true);
      expect(machine.isStarted()).to.equal(true);
      expect(store.listeners.length).to.equal(0);
      expect(store.middlewares.length).to.equal(0);
      expect(store.nListeners.length).to.equal(0);
      expect(store.nMiddlewares.length).to.equal(0);
    });
    it('throws error when creating store with invalid machine', () => {
      expect(() => new Store({})).to.throw();
      expect(() => new Store([])).to.throw();
    });
    it('throws error when creating store on null or undefined machine', () => {
      expect(() => new Store(null)).to.throw();
      expect(() => new Store(undefined)).to.throw();
    });
    it('should be able to mutate listeners at any time', () => {
      const store = new Store(machine);
      expect(store.listeners.length).to.equal(0);
      store.nListeners.push(null);
      store.mutateListeners();
      expect(store.listeners.length).to.equal(1);
    });
    it('should be able to mutate middlewares at any time', () => {
      const store = new Store(machine);
      expect(store.middlewares.length).to.equal(0);
      store.nMiddlewares.push(null);
      store.mutateMiddlewares();
      expect(store.middlewares.length).to.equal(1);
    });
    it('dipatches correctly', () => {
      const store = new Store(machine);
      expect(store.machine.getCurrentState()).to.equal(state1);
      store.dispatch(trans1);
      expect(store.machine.getCurrentState()).to.equal(state2);
    });
    it('throws an error when the action can not be dispatched in the current state', () => {
      const store = new Store(machine);
      expect(store.machine.getCurrentState()).to.equal(state1);
      expect(() => store.dispatch(trans2)).to.throw();
    });
    it('is able to call listeners', () => {
      const store = new Store(machine);
      let a = 1;
      store.subscribe(() => { a += 1; });
      store.callListeners(null, {}, null);
      store.callListeners(null, {}, null);
      expect(a).to.equal(3);
    });
    it('is possible to subscribe', () => {
      const store = new Store(machine);
      let a = 0;
      const uns = store.subscribe(() => { a += 1; });
      store.subscribe(() => { a += 2; });
      store.dispatch(trans1);
      uns();
      store.dispatch(trans2);
      expect(a).to.equal(5);
    });
    it('throws error when the given function is invalid for subscribing', () => {
      const store = new Store(machine);
      expect(() => { store.subscribe(null); }).to.throw();
      expect(() => { store.subscribe(undefined); }).to.throw();
    });
    it('should be able to add any middleware', () => {
      let count = 0;
      const store = new Store(machine);
      const del = store.addMiddleware((next: Dispatch) => (action: Action) => {
        count += 1;
        next(action);
      });
      store.addMiddleware((next: Dispatch) => (action: Action) => {
        count += 2;
        next(action);
      });
      store.dispatch(trans1);
      del();
      store.dispatch(trans2);
      expect(store.machine.getCurrentState()).to.equal(state3);
      expect(count).to.equal(5);
    });
    it('throws error when the given middleware to add is invalid', () => {
      const store = new Store(machine);
      expect(() => store.addMiddleware(null)).to.throw();
      expect(() => store.addMiddleware(undefined)).to.throw();
    });
    it('should be able to bind any amount of valid middlewares', () => {
      let count = 0;
      const store = new Store(machine);
      store.bindMiddleware((next: Dispatch) => (action: Action) => {
        count += 1;
        next(action);
      }, (next: Dispatch) => (action: Action) => {
        count += 2;
        next(action);
      });
      store.dispatch(trans1);
      store.dispatch(trans2);
      expect(store.machine.getCurrentState()).to.equal(state3);
      expect(count).to.equal(6);
    });
    it('throws error when one of the provided middlewares to bind is invalid', () => {
      const store = new Store(machine);
      expect(() => store.bindMiddleware(null)).to.throw();
    });
  });
});
