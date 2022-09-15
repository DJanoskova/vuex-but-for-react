import { deepRecreate } from "object-deep-recreate";

import { GetterType, VuexStoreType } from "./types";
import { getStoreKeyModuleValues, getStoreModule } from "./helpers";
import { ExternalStoreType, StateType } from './externalStore';
import { MutableRefObject } from 'react';

/**
 * gets the current state
 * runs it through all the getters
 * updates the gettersValues where needed
 * @param store
 * @param state
 * @param globalGetters
 */
export const calcAndSetGettersValues = <T, >(
  store: VuexStoreType,
  state: T,
  globalGetters: ExternalStoreType<Record<string, any>>,
) => {
  const getters = getStoreKeyModuleValues(store, 'getters');
  const getterNames = Object.keys(getters);
  if (!getterNames.length) return;

  const setter = (prevValues) => {
    const storedPrev = JSON.parse(JSON.stringify(prevValues));
    getterNames.forEach(getterPath => {
      const moduleNames = getterPath.split('/');
      let originalFn: GetterType<T>;

      let value;

      // alter the state with the logic given in the store config
      if (moduleNames.length === 1) {
        originalFn = store.getters?.[getterPath] as GetterType<T>;

        value = originalFn(state);
      } else {
        const moduleStore = getStoreModule(store, getterPath) as StateType;
        const moduleState = getStoreModule(state, getterPath) as T;

        const getterName = moduleNames[moduleNames.length - 1]
        originalFn = moduleStore.getters?.[getterName] as GetterType<T>;

        value = originalFn(moduleState);
      }

      prevValues[getterPath] = value;
    });

    const newValues = deepRecreate(prevValues, storedPrev);
    return newValues;
  }

  globalGetters.setState(setter)
}

export const getGetterInitialValue = (getterName: string, gettersFns: Record<string, Function>, store: VuexStoreType) => {
  const originalFn = gettersFns[getterName] as GetterType;
  const moduleNames = getterName.split('/');
  let value;

  // alter the state with the logic given in the store config
  if (moduleNames.length === 1) {
    value = originalFn(store.state as StateType);
  } else {
    const moduleStore = getStoreModule(store, getterName) as StateType;
    value = originalFn(moduleStore.state);
  }

  return value;
}

export const getGettersInitialValues = (store: VuexStoreType) => {
  const gettersFns = getStoreKeyModuleValues<Function>(store, 'getters');
  const getterNames = Object.keys(gettersFns);

  const result: Record<string, any> = {};

  if (!getterNames.length) return result;

  getterNames.forEach(getterName => {
    const value = getGetterInitialValue(getterName, gettersFns, store);
    result[getterName] = value;
  });

  return result;
}
