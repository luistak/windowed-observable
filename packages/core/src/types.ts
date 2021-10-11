export type Events<T = any> = T[];

export type ObserverOptions<T = any> = {
  events: T[];
  lastEvent?: T;
};

export type Observer<T = any> = (
  data: T | undefined,
  options: ObserverOptions
) => void;

export type Observers<T = any> = Observer<T>[];

declare global {
  interface Window {
    __shared__: {
      __events__: Record<string, Events>;
      __observers__: Record<string, Observers>;
    };
  }
}
