import { useCallback, useSyncExternalStore } from 'react';

export type ExternalStoreListenerType = () => void;
export type StateType<T = Record<string, any>> = T;
export type SetStateType<T> = (previous: T) => T;

export type ExternalStoreType<T> = {
  getState: () => T;
  setState: (fn: SetStateType<T>) => void;
  subscribe: (listener: ExternalStoreListenerType) => () => void;
};

export const useStore = <T, >(store: ExternalStoreType<T>, propertyName: string): T => {
  const getSnapshot = useCallback(() => {
    return store.getState()[propertyName];
  }, [store, propertyName]);

  return useSyncExternalStore(store.subscribe, getSnapshot);
};

/**
 * https://blog.saeloun.com/2021/12/30/react-18-usesyncexternalstore-api
 */
export const createStore = <T,>(initialState: T): ExternalStoreType<T> => {
  let state: T = initialState;
  const getState = () => state;

  const listeners: Set<ExternalStoreListenerType> = new Set();

  const setState = (fn: SetStateType<T>) => {
    state = fn(state);
    listeners.forEach((l) => l());
  };

  const subscribe = (listener: ExternalStoreListenerType) => {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  };

  return { getState, setState, subscribe };
};
