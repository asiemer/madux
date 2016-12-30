
import chai from 'chai';
import {
  isDict,
  isArr,
  isValidPropDefinition,
  areValidPropDefinitions,
  isValidState,
  areValidStates,
} from '../src/Utils';

const expect = chai.expect;

describe('Utils.js', () => {
  it('should detect correct dictionary', () => {
    expect(isDict({})).to.equal(true);
    expect(isDict({ name: [] })).to.equal(true);
    expect(isDict(null)).to.equal(false);
    expect(isDict(undefined)).to.equal(false);
    expect(isDict(true)).to.equal(false);
    expect(isDict([])).to.equal(false);
    expect(isDict('')).to.equal(false);
  });
  it('should detect correct array', () => {
    expect(isArr({})).to.equal(false);
    expect(isArr({ name: [] })).to.equal(false);
    expect(isArr(null)).to.equal(false);
    expect(isArr(undefined)).to.equal(false);
    expect(isArr(true)).to.equal(false);
    expect(isArr([])).to.equal(true);
    expect(isArr('')).to.equal(false);
    expect(isArr([1])).to.equal(true);
  });
  it('should detect valid prop definition', () => {
    expect(isValidPropDefinition(null)).to.equal(false);
    expect(isValidPropDefinition(undefined)).to.equal(false);
    expect(isValidPropDefinition({})).to.equal(false);
    expect(isValidPropDefinition({ name: [] })).to.equal(false);
    expect(isValidPropDefinition(null)).to.equal(false);
    expect(isValidPropDefinition(undefined)).to.equal(false);
    expect(isValidPropDefinition(true)).to.equal(false);
    expect(isValidPropDefinition([])).to.equal(false);
    expect(isValidPropDefinition('')).to.equal(false);
    expect(isValidPropDefinition([1])).to.equal(false);
    expect(isValidPropDefinition({ name: 'J', required: false })).to.equal(true);
    expect(isValidPropDefinition({ name: 'J', required: true })).to.equal(true);
    expect(isValidPropDefinition({ name: 'J' })).to.equal(true);
    expect(isValidPropDefinition({ required: true })).to.equal(false);
  });
  it('should detect valid prop definitions', () => {
    expect(areValidPropDefinitions([null, { name: 'J' }])).to.equal(false);
    expect(areValidPropDefinitions([
      { name: 'J' },
      { name: 'J', required: true },
    ])).to.equal(true);
  });
  it('should detect valid state', () => {
    expect(isValidState(null)).to.equal(false);
    expect(isValidState(undefined)).to.equal(false);
    expect(isValidState({})).to.equal(false);
    expect(isValidState({ name: [] })).to.equal(false);
    expect(isValidState(null)).to.equal(false);
    expect(isValidState(undefined)).to.equal(false);
    expect(isValidState(true)).to.equal(false);
    expect(isValidState([])).to.equal(false);
    expect(isValidState('')).to.equal(false);
    expect(isValidState([1])).to.equal(false);
    expect(isValidState({ name: 'A' })).to.equal(true);
    expect(isValidState({ name: 'A', props: [null] })).to.equal(false);
    expect(isValidState({ name: 'A', props: [{ name: 'J', required: true }] })).to.equal(true);
  });
  it('should detect valid states', () => {
    expect(areValidStates([null, { name: 'A' }])).to.equal(false);
    expect(areValidStates([
      { name: 'A' },
      { name: 'J', props: [{ name: 'J', required: true }] },
    ])).to.equal(true);
  });
});
