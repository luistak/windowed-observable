import React, { useContext, useEffect, useState, createContext } from 'react';
import { Observable, Observer, SubscriptionOptions } from 'windowed-observable';

interface ObservableContextValue {
  data: any;
  observable?: Observable;
}
const ObservableContext = createContext<ObservableContextValue | undefined>(
  undefined
);

interface MerchantContextProvider {
  namespace: string;
  subscriptionOptions?: SubscriptionOptions;
  children: React.ReactNode;
}

declare global {
  interface Window {
    bla: Observable;
  }
}

export function ObservableProvider<T = any>({
  namespace,
  subscriptionOptions,
  children,
}: MerchantContextProvider) {
  const [data, setData] = useState<T | T[] | undefined>();

  useEffect(() => {
    const observable = new Observable<T>(namespace);

    const observer: Observer<T> = (
      newData: React.SetStateAction<T | T[] | undefined>
    ) => {
      setData(newData);
    };

    observable.subscribe(observer, subscriptionOptions);

    window.bla = observable;

    return () => {
      observable.unsubscribe(observer);
    };
  }, []);

  return (
    <ObservableContext.Provider value={{ data }}>
      {children}
    </ObservableContext.Provider>
  );
}

export function useObservable() {
  const context = useContext(ObservableContext);
  if (context === undefined) {
    throw new Error('useObservable must be used within a ObservableProvider');
  }

  return context;
}
