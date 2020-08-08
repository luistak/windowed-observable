export const EVENTS = '__events__';
export const SHARED = '__shared__';
export const OBSERVERS = '__observers__';

export type EventsArray<T = any> = Array<T>;
export type Observer<T = any> = (data: T | Array<T> | undefined) => void;
export type ObserversArray<T = any> = Array<Observer<T>>;

declare global {
  interface Window {
    [SHARED]: {
      [EVENTS]: Record<string, EventsArray>;
      [OBSERVERS]: Record<string, ObserversArray>;
    };
  }
}

export interface SubscriptionOptions {
  every?: boolean;
  latest?: boolean;
}

class Observable<T = any> {
  _namespace!: string;

  private static initialize() {
    if (!window[SHARED]) {
      window[SHARED] = {
        [EVENTS]: {},
        [OBSERVERS]: {},
      };
    }
    if (!window[SHARED][EVENTS]) {
      window[SHARED][EVENTS] = {};
    }
    if (!window[SHARED][OBSERVERS]) {
      window[SHARED][OBSERVERS] = {};
    }
  }

  constructor(namespace: string) {
    Observable.initialize();

    this.namespace = namespace;
  }

  private get events(): EventsArray<T> {
    return window[SHARED][EVENTS][this._namespace];
  }

  private get observers(): ObserversArray<T> {
    return window[SHARED][OBSERVERS][this._namespace];
  }

  private set events(events: EventsArray<T>) {
    window[SHARED][EVENTS][this._namespace] = events;
  }

  private set observers(observers: ObserversArray<T>) {
    window[SHARED][OBSERVERS][this._namespace] = observers;
  }

  set namespace(namespace: string) {
    this._namespace = namespace;

    if (!this.events) this.events = [];
    if (!this.observers) this.observers = [];
  }

  publish(data: T): void {
    this.observers?.forEach((observer: Observer<T>) => observer(data));

    this.events.push(data);
  }

  dispatch = this.publish;

  subscribe(
    observer: Observer<T>,
    options: SubscriptionOptions = { latest: false, every: false }
  ): void {
    const { every, latest } = options;

    const events = this.events;
    const hasOptions = latest || every;
    if (hasOptions && events.length > 0) {
      if (latest) {
        const lastEvent = events[events.length - 1];
        observer(lastEvent);
      }

      if (every) {
        observer(events);
      }
    }

    this.observers = this.observers.concat(observer);
  }

  unsubscribe(observer: Observer<T>) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  clear() {
    this.observers?.forEach((observer: Observer<T>) => observer(undefined));

    this.events = [];
    this.observers = [];
  }
}

export default Observable;
