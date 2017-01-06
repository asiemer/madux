
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
    const ROOM = {
      name: 'room',
      props: [{
        name: 'number',
        merge: true,
        required: true,
      }],
    };

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

    store.dispatch(leave());
    store.dispatch(logout());
    expect(store.machine.getCurrentState()).to.equal(STRANGER);
  });
  it('Scenario #3', () => {
    const DANGER = {
      name: 'DANGER',
      props: [{
        name: 'level',
        required: true,
        merge: false,
      }],
    };
    const SAFE = { name: 'SAFE' };

    const REPORT_DANGER = 'REPORT_DANGER';
    const CLEAR = 'CLEAR';

    const danger = level => ({ type: REPORT_DANGER, params: { level } });
    const clear = () => ({ type: CLEAR });

    const machine = createMachine(SAFE, DANGER);
    machine.from(SAFE).to(SAFE).on(CLEAR);
    machine.from(SAFE).to(DANGER).on(REPORT_DANGER);
    machine.from(DANGER).to(SAFE).on(CLEAR);
    machine.from(DANGER).to(DANGER).on(REPORT_DANGER);
    const store = machine.buildStore();

    store.dispatch(danger(4));
    store.dispatch(danger(3));
    store.dispatch(clear());
    expect(store.machine.getCurrentState().name).to.equal('SAFE');

    const unsub = store.subscribe((prev, action, next) => {
      expect(JSON.stringify(prev)).to.equal('{"name":"SAFE","props":{}}');
      expect(JSON.stringify(action)).to.equal('{"type":"REPORT_DANGER","params":{"level":5}}');
      expect(JSON.stringify(next)).to.equal('{"name":"DANGER","props":{"level":5}}');
    });
    store.dispatch(danger(5));
    unsub();
    store.dispatch(clear());
  });
  it('Scenario #4', () => {
    let count = 0;

    const DANGER = {
      name: 'DANGER',
      props: [{
        name: 'level',
        required: true,
        merge: false,
      }],
    };
    const SAFE = { name: 'SAFE' };

    const REPORT_DANGER = 'REPORT_DANGER';
    const CLEAR = 'CLEAR';

    const danger = level => ({ type: REPORT_DANGER, params: { level } });
    const clear = () => ({ type: CLEAR });

    const middleware = next => (action) => {
      count += 1;
      next(action);
    };

    const machine = createMachine(SAFE, DANGER);
    machine.from(SAFE).to(SAFE).on(CLEAR);
    machine.from(SAFE).to(DANGER).on(REPORT_DANGER);
    machine.from(DANGER).to(SAFE).on(CLEAR);
    machine.from(DANGER).to(DANGER).on(REPORT_DANGER);
    const store = machine.buildStore().bindMiddleware(middleware);

    store.dispatch(danger(4));
    store.dispatch(danger(3));
    store.dispatch(clear());
    store.dispatch(danger(5));
    store.dispatch(clear());

    expect(count).to.equal(5);
  });
  it('Scenario #5', () => {
    const OUTSIDE = { name: 'OUTSIDE' };
    const HOUSE = {
      name: 'HOUSE',
      props: [{
        name: 'houseNumber',
        required: true,
        merge: true,
      }],
    };
    const ROOM = {
      name: 'ROOM',
      props: [{
        name: 'houseNumber',
        required: true,
        merge: true,
      }, {
        name: 'roomNumber',
        required: true,
        merge: false,
      }],
    };

    const ENTER_HOUSE = 'ENTER_HOUSE';
    const ENTER_ROOM = 'ENTER_ROOM';
    const LEAVE_HOUSE = 'LEAVE_HOUSE';
    const LEAVE_ROOM = 'LEAVE_ROOM';

    const enterHouse = houseNumber => ({ type: ENTER_HOUSE, params: { houseNumber } });
    const enterRoom = roomNumber => ({ type: ENTER_ROOM, params: { roomNumber } });
    const leaveHouse = () => ({ type: LEAVE_HOUSE });
    const leaveRoom = () => ({ type: LEAVE_ROOM });

    const machine = createMachine(OUTSIDE, HOUSE, ROOM);
    machine.from(OUTSIDE).to(HOUSE).on(ENTER_HOUSE);
    machine.from(HOUSE).to(OUTSIDE).on(LEAVE_HOUSE);
    machine.from(HOUSE).to(ROOM).on(ENTER_ROOM);
    machine.from(ROOM).to(HOUSE).on(LEAVE_ROOM);
    const store = machine.buildStore();

    store.dispatch(enterHouse(3));
    store.dispatch(enterRoom(4));

    const unsubscribe = store.subscribe((prev, action, next) => {
      expect(JSON.stringify(prev)).to.equal('{"name":"ROOM","props":{"houseNumber":3,"roomNumber":4}}');
      expect(JSON.stringify(action)).to.equal('{"type":"LEAVE_ROOM"}');
      expect(JSON.stringify(next)).to.equal('{"name":"HOUSE","props":{"houseNumber":3}}');
    });
    store.dispatch(leaveRoom());
    unsubscribe();

    store.dispatch(leaveHouse());
  });
});
