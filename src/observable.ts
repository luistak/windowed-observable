export const EVENTS = '__events__';
export const SHARED = '__shared__';
export const OBSERVERS = '__observers__';

export type EventsArray = Array<any>;
interface EventsArrayMap {
  [namespace: string]: EventsArray
}

export type Observer = (data: any) => void;
export type ObserversArray = Array<Observer>;
interface ObserversArrayMap {
  [namespace: string]: ObserversArray
}

declare global {
  interface Window {
    [SHARED]: any,
    [EVENTS]: EventsArrayMap,
    [OBSERVERS]: ObserversArrayMap
  }
}

export interface SubscriptionOptions {
  every?: boolean,
  latest?: boolean,
}

class Observable {
  _namespace: string

  private static initialize() {
    if (!window[SHARED]) window[SHARED] = {};
    if (!window[SHARED][EVENTS]) window[SHARED][EVENTS] = {};
    if (!window[SHARED][OBSERVERS]) window[SHARED][OBSERVERS] = {};
  }

  constructor(namespace: string) {
    Observable.initialize();

    this.namespace = namespace;
  }

  private get events(): EventsArray {
    return window[SHARED][EVENTS][this._namespace];
  }

  private get observers(): ObserversArray {
    return window[SHARED][OBSERVERS][this._namespace];
  }

  private set events(events: EventsArray) {
    window[SHARED][EVENTS][this._namespace] = events;
  }

  private set observers(listeners: ObserversArray) {
    window[SHARED][OBSERVERS][this._namespace] = listeners;
  }

  set namespace(namespace: string) {
    this._namespace = namespace;

    if (!this.events) this.events = [];
    if (!this.observers) this.observers = [];
  }

  dispatch(data: any): void {
    if (this.observers.length > 0) {
      this.observers.forEach((observer: Observer) => observer(data));
    } else {
      this.events = this.events.concat(data);
    }
  }

  publish(data: any): void {
    if (this.observers.length > 0) {
      this.observers.forEach((observer: Observer) => observer(data));
    } else {
      this.events = this.events.concat(data);
    }
  }

  subscribe(observer: Observer, options: SubscriptionOptions = { latest: false, every: false }): void {
    const { every, latest } = options;

    const events = this.events;
    const hasOptions = latest || every;

    if (hasOptions && events.length > 0) {
      if (latest) {
        const lastEvent = events.pop();
        observer(lastEvent);
      }

      if (every) {
        observer(events);
      }

      this.events = events;
    }

    this.observers = this.observers.concat(observer);
  }

  unsubscribe(observer: Observer) {
    this.observers = this.observers.filter(atualObserver => atualObserver !== observer);
  }

  clear() {
    this.events = [];
    this.observers = [];
  }
}

export default Observable;

