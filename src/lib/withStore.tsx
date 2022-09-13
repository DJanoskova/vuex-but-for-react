import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { deepRecreate } from 'object-deep-recreate';

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
  getStoreModuleName,
} from './helpers';
import { calcAndSetGettersValues } from './getters';
import { createStore, ExternalStoreType, StateType } from './externalStore';

export let globalGetters: ExternalStoreType<unknown> = createStore({});

const withStore = <InheritedStateType, >(Component: (props: any) => JSX.Element, store: VuexStoreType<InheritedStateType>, options: StoreOptionsType = {}) => (props: any) => {
  const globalStoreRef = useRef(createStore<InheritedStateType>(store.state));

  const handleGettersValuesSet = useCallback((newValues: InheritedStateType) => {
    calcAndSetGettersValues<InheritedStateType>(store, newValues, globalGetters as ExternalStoreType<InheritedStateType>);
  }, [options.localStorageName]);

  useEffect(() => {
    // const stateInitialValues = getStoreStateWithModules<InheritedStateType>(store);

    // if (options.localStorageName && stateInitialValues) {
    //   handleStateFillWithLocalValues<InheritedStateType>(stateInitialValues, options.localStorageName);
    // }

    // stateValues.current = stateInitialValues;
    // handleGettersValuesSet(stateInitialValues);
  }, []);

  const mutations = useMemo(() => {
    return getMutations<InheritedStateType>(store, globalStoreRef.current, handleGettersValuesSet);
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
  handleGettersValuesSet: (newValues: T) => void
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

      const setter = (previous: StateType<T>) => {
        const prevStateCloned: T = JSON.parse(JSON.stringify(previous));

        const moduleNames = mutationName.split('/');

        // alter the state with the logic given in the store config
        if (moduleNames.length === 1) {
          originalFn(previous, ...args)
        } else {
          const moduleName = getStoreModuleName(mutationName);
          const moduleState = getStoreModule(previous, moduleName);
          originalFn(moduleState as T, ...args)
        }

        const newValues: T = deepRecreate(previous, prevStateCloned) as T;
        handleGettersValuesSet(newValues);
        return newValues;
      }

      globalStore.setState(setter);
    }
  })

  return values;
}

export default withStore;
