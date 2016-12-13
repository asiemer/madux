
// @flow

import chai from 'chai';
import { State } from '../src/State';

const expect = chai.expect;

describe('State', () => {
  const roomDefinition = { name: 'room', required: true };
  const streetDefinition = { name: 'street', required: true };
  const companionDefinition = { name: 'companion', required: false };

  it('should have correct name', () => {
    const state = new State('LOBBY', []);
    expect(state.name).to.equal('LOBBY');
  });

  it('should accept required props', () => {
    const state = new State('A', [roomDefinition, companionDefinition]);
    const props = { room: 5 };
    expect(state.validate(props)).to.equal(true);
  });

  it('should accept all props', () => {
    const state = new State('A', [roomDefinition, companionDefinition]);
    const props = { room: 5, companion: 'James' };
    expect(state.validate(props)).to.equal(true);
  });

  it('should accept more props', () => {
    const state = new State('A', [roomDefinition, companionDefinition]);
    const props = { room: 5, companion: 'James', city: true };
    expect(state.validate(props)).to.equal(true);
  });

  it('should reject no props', () => {
    const state = new State('A', [roomDefinition, companionDefinition]);
    const props = {};
    expect(state.validate(props)).to.equal(false);
  });

  it('should reject only optional props', () => {
    const state = new State('A', [roomDefinition, streetDefinition, companionDefinition]);
    const props = { companion: 'James' };
    expect(state.validate(props)).to.equal(false);
  });

  it('should reject partial required parameters', () => {
    const state = new State('A', [roomDefinition, streetDefinition, companionDefinition]);
    const props = { room: 5, companion: 'James' };
    expect(state.validate(props)).to.equal(false);
  });

  it('should reject only optional props with add', () => {
    const state = new State('A', [roomDefinition, companionDefinition]);
    state.addProp(streetDefinition);
    const props = { companion: 'James' };
    expect(state.validate(props)).to.equal(false);
  });

  it('should reject partial required parameters with add', () => {
    const state = new State('A', [roomDefinition, companionDefinition]);
    state.addProp(streetDefinition);
    const props = { room: 5, companion: 'James' };
    expect(state.validate(props)).to.equal(false);
  });
});
