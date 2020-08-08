import React, { useContext, useEffect, useState, createContext } from 'react';
import { Observable, Observer, SubscriptionOptions } from 'windowed-observable';

export type DataType<T> = T | T[] | undefined;

export type ObservableContextValue<T = any> = DataType<T> | undefined;

export interface ObservableProviderProps {
  children: React.ReactNode;
}

export interface ReactObservable<T = any> {
  observable: Observable;
  useObservable: () => ObservableContextValue<T>;
  ObservableProvider: React.FC<ObservableProviderProps>;
}

export interface ObservableContextOptions<T = any> extends SubscriptionOptions {
  initialData?: DataType<T>;
}

export function createReactObservable<T = any>(
  namespace: string,
  options?: ObservableContextOptions<T>
): ReactObservable<T> {
  const observable = new Observable<T>(namespace);

  const ObservableContext = createContext<ObservableContextValue<T>>(
    options?.initialData
  );

  function ObservableProvider({ children }: ObservableProviderProps) {
    const [data, setData] = useState<DataType<T>>(options?.initialData);

    useEffect(() => {
      const observer: Observer<T> = (newData: DataType<T>) => {
        setData(newData);
      };

      observable.subscribe(observer, options);

      return () => {
        observable.unsubscribe(observer);
      };
    }, []);

    return (
      <ObservableContext.Provider value={data}>
        {children}
      </ObservableContext.Provider>
    );
  }

  function useObservable() {
    const context = useContext(ObservableContext);

    if (!ObservableContext) {
      throw new Error('useObservable must be used within a ObservableProvider');
    }

    return context;
  }

  return {
    observable,
    useObservable,
    ObservableProvider,
  };
}
