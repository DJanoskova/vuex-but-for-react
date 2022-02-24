import React, {
  useMemo,
  useState,
  useEffect,
  createContext,
  createElement,
  memo,
  useRef,
  MutableRefObject, useCallback
} from 'react';
import { deepRecreate } from "object-deep-recreate";

import { MutationsProvider, ActionsProvider, GettersProvider } from './storeContext';
import { ActionType, GettersContextType, GetterType, MutationType, StateType, StoreType } from './types';
import {
  getStoreKeyModuleValues,
  getStoreModuleName,
  getStoreModule,
  getStoreStateWithModules
} from './helpers';
import { calcAndSetGettersValues } from "./getters";

const withStore = <InheritedStateType, >(Component: (props: any) => JSX.Element, store: StoreType<InheritedStateType>) => (props: any) => {
  const [initRender, setInitRender] = useState(false);
  const [gettersValues, setGettersValues] = useState<StateType>();

  const stateValues = useRef<InheritedStateType>(getStoreStateWithModules<InheritedStateType>(store));
  const prevGettersValues = useRef<StateType>();

  const handleGettersValuesSet = useCallback((newValues: InheritedStateType) => {
    calcAndSetGettersValues<InheritedStateType>(store, newValues, prevGettersValues, setGettersValues);
  }, []);

  useEffect(() => {
    handleGettersValuesSet(stateValues?.current);
    setInitRender(true);
  }, []);

  const mutations = useMemo(() => {
    return getMutations<InheritedStateType>(store, stateValues, handleGettersValuesSet);
  }, []);

  const actions = useMemo(() => {
    const actionsFns = getStoreKeyModuleValues<ActionType>(store, 'actions');
    return actionsFns ?? {};
  }, []);

  const getterContexts = useMemo(() => {
    const gettersFns = getStoreKeyModuleValues<Function>(store, 'getters');
    const getterNames = Object.keys(gettersFns);
    if (!getterNames.length) return {};

    const result: GettersContextType = {}

    getterNames.forEach(getterName => {
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

      const context = createContext(value);

      result[getterName] = context;
    });

    return result;
  }, []);

  const MemoizedComponent = useMemo(() => memo(Component), []);

  // wrapping in useMemo prevents re-creation upon state change
  const getterContextComponents = useMemo(() => {
    return renderGetters(<MemoizedComponent {...props} />, getterContexts, gettersValues);
  }, [getterContexts, gettersValues, MemoizedComponent, props])

  return (
    <MutationsProvider value={mutations}>
      <ActionsProvider value={actions}>
        <GettersProvider value={getterContexts}>
          {initRender && getterContextComponents}
        </GettersProvider>
      </ActionsProvider>
    </MutationsProvider>
  );
}

const renderGetters = (component: JSX.Element, gettersContext: GettersContextType, gettersValues?: StateType) => {
  if (!gettersValues) return component;

  let result: any = createElement('div', { children: component });

  Object.keys(gettersValues).forEach(getterName => {
    const getterContext = gettersContext[getterName];
    const getterValue = gettersValues[getterName];
    result = createElement(getterContext.Provider, { children: result, value: getterValue });
  })

  return result;
}

const getMutations = <T, >(
  store: StoreType,
  stateValues: MutableRefObject<T>,
  handleValuesRefresh: (newValues: T) => void
) => {
  const mutations = getStoreKeyModuleValues(store, 'mutations');
  const mutationNames = Object.keys(mutations);
  if (!mutationNames.length) return {};

  const values: Record<string, (args: any) => void> = {};

  mutationNames.forEach(mutationName => {
    const originalFn = mutations[mutationName] as MutationType<T>;
    values[mutationName] = (...args) => {
      const state: T = stateValues?.current;
      const prevStateCloned: T = JSON.parse(JSON.stringify(state));
      const moduleNames = mutationName.split('/');

      // alter the state with the logic given in the store config
      if (moduleNames.length === 1) {
        originalFn(state, ...args)
      } else {
        const moduleName = getStoreModuleName(mutationName);
        const moduleState = getStoreModule(state, moduleName);
        originalFn(moduleState as T, ...args)
      }

      const newValues: T = deepRecreate(state, prevStateCloned) as T

      stateValues.current = newValues;
      handleValuesRefresh(newValues);
    }
  })

  return values;
}

export default withStore;
