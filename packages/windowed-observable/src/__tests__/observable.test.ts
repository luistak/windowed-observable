import Observable, {
  SHARED,
  EVENTS,
  OBSERVERS,
  SubscriptionOptions,
} from '../observable';

let observable: any;
const namespace: string = 'naruto';

beforeEach(() => {
  observable = new Observable(namespace);
});

afterEach(() => {
  observable.clear();
});

describe('Observables Test', () => {
  it('Should add the namespace on the window', () => {
    const emptyArray: Array<any> = [];

    expect(window[SHARED][EVENTS][namespace]).toEqual(emptyArray);
    expect(window[SHARED][OBSERVERS][namespace]).toEqual(emptyArray);
  });

  it('Should receive an event', () => {
    const event = 'Rasengan!';

    observable.subscribe((jutso: string) => {
      expect(jutso).toEqual(event);
    });

    observable.publish(event);
  });

  it('Should receive the latest event', () => {
    const event = 'Rasengan!';
    observable.publish(event);
    const subscriptionOptions: SubscriptionOptions = {
      latest: true,
    };

    observable.subscribe((jutso: string) => {
      expect(jutso).toEqual(event);
    }, subscriptionOptions);
  });

  it('Should receive every event', () => {
    const events = [
      'Kage bunshin',
      'Kage bunshin',
      'Kage bunshin',
      'Kage bunshin',
    ];

    events.forEach((event: string) => {
      observable.publish(event);
    });

    const subscriptionOptions: SubscriptionOptions = {
      every: true,
    };

    observable.subscribe((bunshins: string[]) => {
      expect(bunshins).toHaveLength(events.length);
    }, subscriptionOptions);
  });
});
