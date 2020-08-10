import React, {
  useContext,
  useEffect,
  useState,
  createContext,
  useCallback,
} from 'react';

import { Observable, SubscriptionOptions } from 'windowed-observable';

export type DataType<T> = T | T[] | undefined;

export interface ObservableContextValue<T = any> {
  data: DataType<T>;
  publish: (data: T) => void;
}

export interface ObservableProviderProps<T = any> {
  onChange?: (data: DataType<T>) => void;
  children: React.ReactNode;
}

export interface ReactObservable<T = any> {
  observable: Observable;
  useObservable: () => ObservableContextValue<T>;
  ObservableProvider: React.FC<ObservableProviderProps<T>>;
}

export interface ObservableContextOptions<T = any> extends SubscriptionOptions {
  initialData?: DataType<T>;
}

export function createReactObservable<T = any>(
  namespace: string,
  options?: ObservableContextOptions<T>
): ReactObservable<T> {
  const observable = new Observable<T>(namespace);
  function publish(data: T) {
    observable.publish(data);
  }

  const ObservableContext = createContext<
    ObservableContextValue<T> | undefined
  >(undefined);

  function ObservableProvider({
    children,
    onChange,
  }: ObservableProviderProps<T>) {
    const [data, setData] = useState<DataType<T>>(options?.initialData);

    const observer = (newData: DataType<T>) => {
      setData(newData);
      if (onChange) {
        onChange(newData);
      }
    };

    const memoizedObserver = useCallback(observer, [onChange]);

    useEffect(() => {
      observable.subscribe(memoizedObserver, options);

      return () => {
        observable.unsubscribe(memoizedObserver);
      };
    }, [memoizedObserver]);

    return (
      <ObservableContext.Provider value={{ data, publish }}>
        {children}
      </ObservableContext.Provider>
    );
  }

  function useObservable() {
    const context = useContext(ObservableContext);
    if (context === undefined) {
      throw new Error(
        'useObservable must be used within an ObservableProvider'
      );
    }

    return context;
  }

  return {
    observable,
    useObservable,
    ObservableProvider,
  };
}
