
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
  describe('Store', () => {
    describe('Constructor', () => {
      it('should work with valid machine', () => {
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
      it('throws on invalid machine', () => {
        expect(() => new Store({})).to.throw();
        expect(() => new Store([])).to.throw();
      });
      it('throws on null or undefined machine', () => {
        expect(() => new Store(null)).to.throw();
        expect(() => new Store(undefined)).to.throw();
      });
    });
    describe('Function: mutateListeners', () => {
      it('should work at any time', () => {
        const store = new Store(machine);
        expect(store.listeners.length).to.equal(0);
        store.nListeners.push(null);
        store.mutateListeners();
        expect(store.listeners.length).to.equal(1);
      });
    });
    describe('Function: mutateMiddlewares', () => {
      it('should work at any time', () => {
        const store = new Store(machine);
        expect(store.middlewares.length).to.equal(0);
        store.nMiddlewares.push(null);
        store.mutateMiddlewares();
        expect(store.middlewares.length).to.equal(1);
      });
    });
    describe('Function: dispatch', () => {
      it('should dipatch correctly', () => {
        const store = new Store(machine);
        expect(store.machine.getCurrentState()).to.equal(state1);
        store.dispatch(trans1);
        expect(store.machine.getCurrentState()).to.equal(state2);
      });
      it('throws when the action can not be dispatched in state', () => {
        const store = new Store(machine);
        expect(store.machine.getCurrentState()).to.equal(state1);
        expect(() => store.dispatch(trans2)).to.throw();
      });
    });
    describe('Function: callListeners', () => {
      it('should work at any time', () => {
        const store = new Store(machine);
        let a = 1;
        store.subscribe(() => { a += 1; });
        store.callListeners(null, {}, null);
        store.callListeners(null, {}, null);
        expect(a).to.equal(3);
      });
    });
    describe('Function: subscribe', () => {
      it('should work for any function', () => {
        const store = new Store(machine);
        let a = 0;
        const uns = store.subscribe(() => { a += 1; });
        store.subscribe(() => { a += 2; });
        store.dispatch(trans1);
        uns();
        store.dispatch(trans2);
        expect(a).to.equal(5);
      });
      it('throws when the given function is invalid', () => {
        const store = new Store(machine);
        expect(() => { store.subscribe(null); }).to.throw();
        expect(() => { store.subscribe(undefined); }).to.throw();
      });
    });
    describe('Function: addMiddleware', () => {
      it('should work for any middleware', () => {
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
      it('throws when the given middleware is invalid', () => {
        const store = new Store(machine);
        expect(() => store.addMiddleware(null)).to.throw();
        expect(() => store.addMiddleware(undefined)).to.throw();
      });
    });
    describe('Function: bindMiddlewares', () => {
      it('should work for any amount of valid middlewares', () => {
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
      it('throws when one of the provided middlewares is invalid', () => {
        const store = new Store(machine);
        expect(() => store.bindMiddleware(null)).to.throw();
      });
    });
  });
  describe('Creators', () => {
    it('should create a store', () => {
      const storeA = new Store(machine);
      const storeB = createStore(machine);
      expect(storeA.machine).to.equal(machine);
      expect(storeB.machine).to.equal(machine);
    });
  });
});
