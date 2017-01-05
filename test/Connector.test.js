
import chai from 'chai';
import {
  createConnector,
  Connector,
} from '../src/Connector';

const expect = chai.expect;

describe('Connector.js', () => {
  const stateA = { name: 'A' };
  const stateB = { name: 'B' };
  const actionType = 'ACTION';
  const anotherActionType = 'ANOTHER';
  describe('Creators', () => {
    it('should create Connector', () => {
      const connectorA = createConnector(stateA);
      const connectorB = new Connector(stateA);
      expect(connectorA.state).to.equal(connectorB.state);
    });
  });
  describe('Connector', () => {
    it('creates a Connector with valid state', () => {
      const connector = createConnector(stateA);
      expect(connector.state).to.equal(stateA);
      expect(Array.from(connector.next.keys()).length).to.equal(0);
      expect(Array.from(connector.previous.keys()).length).to.equal(0);
    });
    it('fails to create a Connector with invalid state', () => {
      expect(() => createConnector({})).to.throw();
    });
    it('fails to create a Connector with no, null or undefined state', () => {
      expect(() => createConnector()).to.throw();
      expect(() => createConnector(null)).to.throw();
      expect(() => createConnector(undefined)).to.throw();
    });
    it('adds a forward transition with valid type and state', () => {
      const connector = createConnector(stateA);
      connector.addTransitionForwards(actionType, stateB.name);
      expect(connector.next.get(actionType)).to.equal(stateB.name);
    });
    it('doesn\'t add a transition with type null or undefined', () => {
      const connector = createConnector(stateA);
      connector.addTransitionForwards(null, stateB.name);
      expect(Array.from(connector.next.keys()).length).to.equal(0);
      connector.addTransitionForwards(undefined, stateB.name);
      expect(Array.from(connector.next.keys()).length).to.equal(0);
    });
    it('doesn\'t add a transition with state null or undefined', () => {
      const connector = createConnector(stateA);
      connector.addTransitionForwards(actionType, null);
      expect(Array.from(connector.next.keys()).length).to.equal(0);
      connector.addTransitionForwards(actionType, undefined);
      expect(Array.from(connector.next.keys()).length).to.equal(0);
    });
    it('throws an error with duplicate action for transition forwards', () => {
      const connector = createConnector(stateA);
      connector.addTransitionForwards(actionType, stateA.name);
      expect(() => connector.addTransitionForwards(actionType, stateB.name)).to.throw();
    });
    it('add a backwards transition with valid type and state', () => {
      const connector = createConnector(stateA);
      connector.addTransitionBackwards(actionType, stateB.name);
      connector.addTransitionBackwards(actionType, stateB.name);
      expect(connector.previous.get(actionType).size).to.equal(1);
      connector.addTransitionBackwards(actionType, stateA.name);
      connector.addTransitionBackwards(actionType, stateB.name);
      expect(connector.previous.get(actionType).size).to.equal(2);
      expect(connector.previous.get(actionType).has(stateB.name)).to.equal(true);
    });
    it('doesn\'t throw on null of undefined parameters', () => {
      const connector = createConnector(stateA);
      connector.addTransitionBackwards(null, stateB.name);
      connector.addTransitionBackwards(undefined, stateA.name);
      expect(connector.previous.get(null).has(stateB.name)).to.equal(true);
      expect(connector.previous.get(undefined).has(stateA.name)).to.equal(true);
      expect(connector.previous.get(null).size).to.equal(1);
      expect(connector.previous.get(undefined).size).to.equal(1);
    });
    it('returns correct destination state name', () => {
      const connector = createConnector(stateA);
      connector.addTransitionForwards(actionType, stateB.name);
      expect(connector.getDestinationStateName(actionType)).to.equal(stateB.name);
    });
    it('returns undefined when the destination state is not found', () => {
      const connector = createConnector(stateA);
      expect(connector.getDestinationStateName(actionType)).to.equal(undefined);
    });
    it('returns correct set of source state names', () => {
      const connector = createConnector(stateA);
      connector.addTransitionBackwards(actionType, stateA.name);
      connector.addTransitionBackwards(actionType, stateB.name);
      expect(connector.getSourceStateNames(actionType).has(stateA.name)).to.equal(true);
      expect(connector.getSourceStateNames(actionType).has(stateB.name)).to.equal(true);
      expect(connector.getSourceStateNames(actionType).size).to.equal(2);
    });
    it('returns empty set when no source states are found', () => {
      const connector = createConnector(stateA);
      expect(connector.getSourceStateNames(actionType).size).to.equal(0);
    });
    it('returns correct set of possible actions', () => {
      const connector = createConnector(stateA);
      connector.addTransitionForwards(actionType, stateA.name);
      connector.addTransitionForwards(anotherActionType, stateB.name);
      expect(connector.getPossibleActions().has(actionType)).to.equal(true);
      expect(connector.getPossibleActions().has(anotherActionType)).to.equal(true);
      expect(connector.getPossibleActions().size).to.equal(2);
    });
  });
});
