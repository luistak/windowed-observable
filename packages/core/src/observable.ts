import { Events, Observer, Observers } from './types';

export const EVENTS = '__events__';
export const SHARED = '__shared__';
export const OBSERVERS = '__observers__';

export class Observable<T = any> {
  private _namespace!: string;

  // istanbul ignore next
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

  set namespace(namespace: string) {
    this._namespace = namespace;

    // istanbul ignore next
    if (!this.events) this.events = [];

    // istanbul ignore next
    if (!this.observers) this.observers = [];
  }

  private get events(): Events<T> {
    return window[SHARED][EVENTS][this._namespace];
  }

  private set events(newEvents: Events<T>) {
    window[SHARED][EVENTS][this._namespace] = newEvents;
  }

  private get observers(): Observers<T> {
    return window[SHARED][OBSERVERS][this._namespace];
  }

  private set observers(newObservers: Observers<T>) {
    window[SHARED][OBSERVERS][this._namespace] = newObservers;
  }

  getEvents(): Events<T> {
    return this.events;
  }

  getLastEvent(): T | undefined {
    const events = this.events;
    if (!events.length) {
      return;
    }

    const lastEvent = events[events.length - 1];

    return lastEvent;
  }

  publish(data: T): void {
    const events = this.events;
    const lastEvent = this.getLastEvent();

    this.observers.forEach((observer) => observer(data, { events, lastEvent }));

    this.events.push(data);
  }

  dispatch = this.publish;

  subscribe(observer: Observer<T>): void {
    this.observers = this.observers.concat(observer);
  }

  unsubscribe(observer: Observer<T>): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  clear(): void {
    const events = this.events;
    const lastEvent = this.getLastEvent();

    this.observers.forEach((observer) =>
      observer(undefined, { events, lastEvent })
    );

    this.events = [];
    this.observers = [];
  }
}
