import {
  SHARED,
  EVENTS,
  OBSERVERS,
  SubscriptionOptions,
  Observable,
} from '../observable';

const namespace = 'naruto';
const observable = new Observable(namespace);

afterEach(() => observable.clear());

describe('Observable', () => {
  it('should add the namespace on the window', () => {
    const emptyArray: Array<any> = [];

    expect(window[SHARED][EVENTS][namespace]).toEqual(emptyArray);
    expect(window[SHARED][OBSERVERS][namespace]).toEqual(emptyArray);
  });

  it('should store published events without observers', () => {
    observable.publish('something');

    expect(window[SHARED][EVENTS][namespace]).toHaveLength(1);
  });

  it('should receive an event', () => {
    const event = 'Rasengan!';

    const mockedObserver = jest.fn();
    observable.subscribe(mockedObserver);

    expect(window[SHARED][OBSERVERS][namespace]).toHaveLength(1);

    observable.publish(event);
    observable.dispatch(event);

    expect(mockedObserver).toHaveBeenCalledWith(event);
    expect(mockedObserver).toHaveBeenCalledTimes(2);
    expect(window[SHARED][EVENTS][namespace]).toHaveLength(2);
  });

  describe('Subscription options', () => {
    it('should receive the latest event when subscribing after a published event', () => {
      const event = 'Rasengan!';
      observable.publish(event);
      const subscriptionOptions: SubscriptionOptions = {
        latest: true,
      };

      const mockedObserver = jest.fn();
      observable.subscribe(mockedObserver, subscriptionOptions);
      observable.publish(event);

      expect(mockedObserver).toHaveBeenCalledWith(event);
    });

    it('should receive every event when subscribing', () => {
      const events = [
        'Kage bunshin 1',
        'Kage bunshin 2',
        'Kage bunshin 3',
        'Kage bunshin 4',
      ];

      events.forEach((event: string) => {
        observable.publish(event);
      });

      const subscriptionOptions: SubscriptionOptions = {
        every: true,
      };

      const mockedObserver = jest.fn();
      observable.subscribe(mockedObserver, subscriptionOptions);

      expect(mockedObserver).toHaveBeenCalled();
      expect(mockedObserver).toHaveBeenCalledWith(events);
    });
  });
});
