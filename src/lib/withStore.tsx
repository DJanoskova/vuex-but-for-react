import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { ActionsProvider, MutationsProvider, GlobalStoreProvider } from './storeContext';
import {
  ActionType,
  MutationType,
  StoreOptionsType,
  VuexStoreType
} from './types';
import {
  getStoreKeyModuleValues,
  getStoreModule,
  getStoreModuleName, getStoreStateWithModules, handleStateFillWithLocalValues,
} from './helpers';
import { calcAndSetGettersValues } from './getters';
import { createStore, ExternalStoreType, StateType } from './externalStore';


const withStore = <InheritedStateType, >(Component: (props: any) => JSX.Element, store: VuexStoreType<InheritedStateType>, options: StoreOptionsType = {}) => (props: any) => {
  const globalStoreRef = useRef(createStore<InheritedStateType>(store.state));
  const globalGettersRef = useRef(createStore({}));

  const handleGettersValuesSet = useCallback((newValues: InheritedStateType) => {
    calcAndSetGettersValues<InheritedStateType>(store, newValues, globalGettersRef.current);
  }, [options.localStorageName]);

  useEffect(() => {
    const stateInitialValues = getStoreStateWithModules<InheritedStateType>(store);

    if (options.localStorageName && stateInitialValues) {
      handleStateFillWithLocalValues<InheritedStateType>(stateInitialValues, options.localStorageName);
    }

    globalStoreRef.current.setState(() => stateInitialValues);
    handleGettersValuesSet(stateInitialValues);
  }, []);

  const mutations = useMemo(() => {
    return getMutations<InheritedStateType>(store, globalStoreRef.current, handleGettersValuesSet, options.localStorageName);
  }, [handleGettersValuesSet]);

  const actions = useMemo(() => {
    const actionsFns = getStoreKeyModuleValues<ActionType>(store, 'actions');
    return actionsFns ?? {};
  }, []);

  return (
    <MutationsProvider value={mutations}>
      <ActionsProvider value={actions}>
        <GlobalStoreProvider value={globalStoreRef.current}>
          <Component {...props} />
        </GlobalStoreProvider>
      </ActionsProvider>
    </MutationsProvider>
  );
}

const getMutations = <T, >(
  storeConfig: VuexStoreType,
  globalStore: ExternalStoreType<T>,
  handleGettersValuesSet: (newValues: T) => void,
  storageName?: string,
) => {
  const mutations = getStoreKeyModuleValues(storeConfig, 'mutations');
  const mutationNames = Object.keys(mutations);
  if (!mutationNames.length) return {};

  const values: Record<string, (args: any) => void> = {};

  mutationNames.forEach(mutationName => {
    const originalFn = mutations[mutationName] as MutationType<T>;
    values[mutationName] = (...args) => {
      if (!globalStore) {
        throw new Error('No store found')
      }

      const setter = (state: StateType<T>) => {
        const moduleNames = mutationName.split('/');

        // alter the state with the logic given in the store config
        if (moduleNames.length === 1) {
          originalFn(state, ...args)
        } else {
          const moduleName = getStoreModuleName(mutationName);
          const moduleState = getStoreModule(state, moduleName);
          originalFn(moduleState as T, ...args)
        }

        handleGettersValuesSet(state);
        if (storageName) {
          localStorage.setItem(storageName, JSON.stringify(state))
        }
        return state;
      }

      globalStore.setState(setter);
    }
  })

  return values;
}

export default withStore;
