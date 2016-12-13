
// @flow

import chai from 'chai';
import { Props } from '../src/Props';

const expect = chai.expect;

describe('Props', () => {
  const roomDefinition = { name: 'room', required: true };
  const streetDefinition = { name: 'street', required: true };
  const companionDefinition = { name: 'companion', required: false };

  it('should accept required props', () => {
    const defs = new Props([roomDefinition, companionDefinition]);
    const props = { room: 5 };
    expect(defs.validate(props)).to.equal(true);
  });

  it('should accept all props', () => {
    const defs = new Props([roomDefinition, companionDefinition]);
    const props = { room: 5, companion: 'James' };
    expect(defs.validate(props)).to.equal(true);
  });

  it('should accept more props', () => {
    const defs = new Props([roomDefinition, companionDefinition]);
    const props = { room: 5, companion: 'James', city: true };
    expect(defs.validate(props)).to.equal(true);
  });

  it('should reject no props', () => {
    const defs = new Props([roomDefinition, companionDefinition]);
    const props = {};
    expect(defs.validate(props)).to.equal(false);
  });

  it('should reject only optional props', () => {
    const defs = new Props([roomDefinition, streetDefinition, companionDefinition]);
    const props = { companion: 'James' };
    expect(defs.validate(props)).to.equal(false);
  });

  it('should reject partial required parameters', () => {
    const defs = new Props([roomDefinition, streetDefinition, companionDefinition]);
    const props = { room: 5, companion: 'James' };
    expect(defs.validate(props)).to.equal(false);
  });
});
