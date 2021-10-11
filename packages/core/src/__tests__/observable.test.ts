import f from 'faker';
import { SHARED, EVENTS, OBSERVERS } from '../observable';
import { Observable } from '../index';

function mockObservable() {
  const observer = jest.fn();
  const namespace = f.datatype.uuid();
  const observable = new Observable(namespace);

  return { observer, namespace, observable };
}

describe('Observable', () => {
  it('should add the namespace on the window', () => {
    const { namespace } = mockObservable();
    const emptyArray: any[] = [];

    expect(window[SHARED][EVENTS][namespace]).toEqual(emptyArray);
    expect(window[SHARED][OBSERVERS][namespace]).toEqual(emptyArray);
  });

  it('should store published events without observers', () => {
    const { namespace, observable } = mockObservable();
    observable.publish('something');

    expect(window[SHARED][EVENTS][namespace]).toHaveLength(1);
  });

  it('should receive an event accordingly', () => {
    const { observer, namespace, observable } = mockObservable();

    observable.subscribe(observer);

    expect(window[SHARED][OBSERVERS][namespace]).toHaveLength(1);

    const firstEvent = f.datatype.uuid();

    observable.publish(firstEvent);
    expect(observer).toHaveBeenCalledWith(firstEvent, {
      events: [firstEvent],
      lastEvent: undefined,
    });

    const newEvent = f.datatype.uuid();
    observable.dispatch(newEvent);
    expect(observer).toHaveBeenCalledWith(newEvent, {
      events: [firstEvent, newEvent],
      lastEvent: firstEvent,
    });

    expect(observer).toHaveBeenCalledTimes(2);
    expect(window[SHARED][EVENTS][namespace]).toHaveLength(2);
  });

  it('should unsubscribe an observer accordingly', () => {
    const { observable, observer } = mockObservable();

    observable.subscribe(observer);

    const event = f.datatype.uuid();

    observable.unsubscribe(observer);

    observable.publish(event);

    expect(observer).not.toHaveBeenCalled();
    expect(observable.getEvents()).toStrictEqual([event]);
    expect(observable.getLastEvent()).toStrictEqual(event);
  });

  it('should clear every observer accordingly', () => {
    const { observable, observer } = mockObservable();

    observable.subscribe(observer);

    const event = f.datatype.uuid();

    observable.clear();

    observable.publish(event);

    expect(observer).toHaveBeenCalledWith(undefined, {
      events: [],
      lastEvent: undefined,
    });
    expect(observable.getEvents()).toStrictEqual([event]);
    expect(observable.getLastEvent()).toStrictEqual(event);
  });

  it('should get every event and the last event accordingly', () => {
    const { observable, observer } = mockObservable();

    observable.subscribe(observer);

    const events = [f.datatype.uuid(), f.datatype.uuid(), f.datatype.uuid()];

    events.forEach((event) => {
      observable.publish(event);
    });

    expect(observer).toHaveBeenCalledTimes(events.length);

    expect(observable.getEvents()).toStrictEqual(events);
    expect(observable.getLastEvent()).toStrictEqual(events[events.length - 1]);
  });
});
