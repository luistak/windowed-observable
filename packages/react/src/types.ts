import { FC } from 'react';
import { Observable, Observer } from 'windowed-observable';

export type ObservableData<T = any> = {
  data?: T;
  events: T[];
  lastEvent?: T;
};

export type ObservablePublish<T = any> = (data: T) => void;

export interface ObservableContextValue<T = any> extends ObservableData<T> {
  publish: ObservablePublish<T>;
}

export interface ObservableProviderProps<T = any> {
  onChange?: Observer<T>;
}

export type UseObservableReturn<T = any> = [
  Omit<ObservableContextValue<T>, 'publish'>,
  ObservablePublish<T>
];

export interface ReactObservable<T = any> {
  observable: Observable<T>;
  ObservableProvider: FC<ObservableProviderProps<T>>;
  useObservable: () => UseObservableReturn<T>;
}

export interface CreateReactObservableOptions<T = any> {
  initialData?: T;
}
