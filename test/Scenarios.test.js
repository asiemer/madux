
import chai from 'chai';
import { createMachine } from '../src/Machine';

const expect = chai.expect;

describe('Scenarios', () => {
  it('Scenario #1', () => {
    const STRANGER = { name: 'stranger' };
    const LOBBY = { name: 'lobby' };
    const ROOM = { name: 'room' };

    const SIGNIN = 'SIGNIN';
    const SIGNOUT = 'SIGNOUT';
    const ENTER = 'ENTER';
    const LEAVE = 'LEAVE';
    const SEND = 'SEND';

    const createAction = (type, params = {}) => ({ type, params });
    const login = () => createAction(SIGNIN);
    const logout = () => createAction(SIGNOUT);
    const leave = () => createAction(LEAVE);
    const enter = () => createAction(ENTER);
    const send = () => createAction(SEND);

    const machine = createMachine(STRANGER, LOBBY, ROOM);
    machine.from(STRANGER).to(LOBBY).on(SIGNIN);
    machine.from(LOBBY).to(STRANGER).on(SIGNOUT);
    machine.from(LOBBY).to(ROOM).on(ENTER);
    machine.from(ROOM).to(LOBBY).on(LEAVE);
    machine.from(ROOM).to(STRANGER).on(SIGNOUT);
    machine.from(ROOM).to(ROOM).on(SEND);
    const store = machine.buildStore();

    store.dispatch(login());
    store.dispatch(enter());
    store.dispatch(send());
    expect(store.machine.getCurrentState()).to.equal(ROOM);

    store.dispatch(leave());
    store.dispatch(logout());
    expect(store.machine.getCurrentState()).to.equal(STRANGER);
  });
  it('Scenario #2', () => {
    const STRANGER = { name: 'stranger' };
    const LOBBY = { name: 'lobby' };
    const ROOM = { name: 'room', props: [{ name: 'number', required: true }] };

    const SIGNIN = 'SIGNIN';
    const SIGNOUT = 'SIGNOUT';
    const ENTER = 'ENTER';
    const LEAVE = 'LEAVE';
    const SEND = 'SEND';

    const createAction = (type, params = {}) => ({ type, params });
    const login = () => createAction(SIGNIN);
    const logout = () => createAction(SIGNOUT);
    const leave = () => createAction(LEAVE);
    const enter = number => createAction(ENTER, { number });
    const send = msg => createAction(SEND, { msg });

    const machine = createMachine(STRANGER, LOBBY, ROOM);
    machine.from(STRANGER).to(LOBBY).on(SIGNIN);
    machine.from(LOBBY).to(STRANGER).on(SIGNOUT);
    machine.from(LOBBY).to(ROOM).on(ENTER);
    machine.from(ROOM).to(LOBBY).on(LEAVE);
    machine.from(ROOM).to(STRANGER).on(SIGNOUT);
    machine.from(ROOM).to(ROOM).on(SEND);
    const store = machine.buildStore();

    store.dispatch(login());
    store.dispatch(enter('#1'));
    store.dispatch(send('hello'));
    expect(store.machine.getCurrentState()).to.equal(ROOM);
    // console.log(store.machine.options);

    store.dispatch(leave());
    store.dispatch(logout());
    expect(store.machine.getCurrentState()).to.equal(STRANGER);
  });
});
