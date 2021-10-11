import React, {
  useContext,
  useEffect,
  useState,
  createContext,
  FC,
  useMemo,
} from 'react';
import {
  CreateReactObservableOptions,
  ObservableContextValue,
  ObservableData,
  ObservableProviderProps,
  ReactObservable,
  UseObservableReturn,
} from './types';

import { Observable, Observer } from 'windowed-observable';

const ObservableProviderDisplayName = 'ObservableProvider';

export const UseObservableError = `useObservable must be used within an ${ObservableProviderDisplayName}`;

export function createReactObservable<T = any>(
  namespace: string,
  options?: CreateReactObservableOptions<T>
): ReactObservable<T> {
  const observable = new Observable<T>(namespace);

  const ObservableContext = createContext<
    ObservableContextValue<T> | undefined
  >(undefined);

  const ObservableProvider: FC<ObservableProviderProps<T>> = ({
    children,
    onChange,
  }) => {
    const [data, setData] = useState<ObservableData<T>>({
      data: options?.initialData,
      events: [],
      lastEvent: undefined,
    });

    useEffect(() => {
      const observer: Observer<T> = (newData, { events, lastEvent }) => {
        setData({ data: newData, events, lastEvent });
      };

      observable.subscribe(observer);

      return () => {
        observable.unsubscribe(observer);
      };
    }, []);

    useEffect(() => {
      if (!onChange) {
        return;
      }

      observable.subscribe(onChange);

      return () => {
        observable.unsubscribe(onChange);
      };
    }, [onChange]);

    const value = useMemo(
      () => ({
        ...data,
        publish: observable.publish,
      }),
      [data]
    );

    return (
      <ObservableContext.Provider value={value}>
        {children}
      </ObservableContext.Provider>
    );
  };

  ObservableProvider.displayName = ObservableProviderDisplayName;

  function useObservable(): UseObservableReturn<T> {
    const ctx = useContext(ObservableContext);
    if (ctx === undefined) {
      throw new Error(UseObservableError);
    }

    const { publish, ...context } = ctx;

    return [context, publish];
  }

  return {
    observable,
    useObservable,
    ObservableProvider,
  };
}
