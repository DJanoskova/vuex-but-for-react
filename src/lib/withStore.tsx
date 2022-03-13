import React, {
  createContext,
  createElement,
  memo,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { deepRecreate } from 'object-deep-recreate';

import { ActionsProvider, GettersProvider, MutationsProvider } from './storeContext';
import { ActionType, GettersContextType, MutationType, StateType, StoreOptionsType, StoreType } from './types';
import {
  getStoreKeyModuleValues,
  getStoreModule,
  getStoreModuleName,
  getStoreStateWithModules,
  handleStateFillWithLocalValues
} from './helpers';
import { calcAndSetGettersValues, getGetterInitialValue } from './getters';

const withStore = <InheritedStateType, >(Component: (props: any) => JSX.Element, store: StoreType<InheritedStateType>, options: StoreOptionsType) => (props: any) => {
  const [initRender, setInitRender] = useState(false);
  const [gettersValues, setGettersValues] = useState<StateType>();

  const stateValues = useRef<InheritedStateType>();
  const prevGettersValues = useRef<StateType>();

  const handleGettersValuesSet = useCallback((newValues: InheritedStateType) => {
    const newState = calcAndSetGettersValues<InheritedStateType>(store, newValues, prevGettersValues, setGettersValues);
    if (options.localStorageName) {
      localStorage.setItem(options.localStorageName, JSON.stringify(newState))
    }
  }, []);

  useEffect(() => {
    const stateInitialValues = getStoreStateWithModules<InheritedStateType>(store);

    if (options.localStorageName) {
      handleStateFillWithLocalValues(options.localStorageName, stateValues || {});
    }

    stateValues.current = stateInitialValues;

    handleGettersValuesSet(stateInitialValues);
    setInitRender(true);
  }, []);

  const mutations = useMemo(() => {
    return getMutations<InheritedStateType>(
      store,
      stateValues as MutableRefObject<InheritedStateType>,
      handleGettersValuesSet
    );
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
      const value = getGetterInitialValue(getterName, gettersFns, store);
      result[getterName] = createContext(value);
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
