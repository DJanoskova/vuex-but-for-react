import React, {
  useMemo,
  useState,
  useEffect,
  createContext,
  createElement,
  memo,
  Dispatch,
  SetStateAction
} from 'react';

import { MutationsProvider, ActionsProvider, GettersProvider } from './storeContext';
import { ActionType, GettersContextType, GetterType, MutationType, StateType, StoreType } from "./types";
import { getStoreKeyModuleValues, getStoreModuleName, getStoreModule } from "./helpers";

const withStore = <InheritedStateType, >(Component: (props: any) => JSX.Element, store: StoreType<InheritedStateType>) => (props: any) => {
  const [state, setState] = useState<InheritedStateType>(getStoreStateWithModules<InheritedStateType>(store));
  const [initRender, setInitRender] = useState(false);
  const [gettersValues, setGettersValues] = useState<StateType>();

  const mutations = useMemo(() => {
    return getMutations<InheritedStateType>(store, setState);
  }, []);

  const actions = useMemo(() => {
    const actionsFns = getStoreKeyModuleValues<ActionType>(store, 'actions');
    return actionsFns ?? {};
  }, []);

  const getters = useMemo(() => {
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

      // const value = originalFn(store.state as StateType);
      const context = createContext(value);

      result[getterName] = context;
    });

    return result;
  }, []);

  useEffect(() => {
    handleGettersValuesSet<InheritedStateType>(store, state, setGettersValues);
    setInitRender(true);
  }, [state]);

  const MemoizedComponent = useMemo(() => memo(Component), []);

  // wrapping in useMemo prevents re-creation upon state change
  const getterContexts = useMemo(() => {
    return renderGetters(<MemoizedComponent {...props} />, getters, gettersValues);
  }, [getters, gettersValues, MemoizedComponent, props])

  return (
    <MutationsProvider value={mutations}>
      <ActionsProvider value={actions}>
        <GettersProvider value={getters}>
          {initRender && getterContexts}
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

const getMutations = <T, >(store: StoreType, setState: Dispatch<SetStateAction<T>>) => {
  const mutations = getStoreKeyModuleValues(store, 'mutations');
  const mutationNames = Object.keys(mutations);
  if (!mutationNames.length) return {};

  const values: Record<string, (args: any) => void> = {};

  mutationNames.forEach(mutationName => {
    const originalFn = mutations[mutationName] as MutationType;
    values[mutationName] = (...args) => {
      setState(prevState => {
        const newState: T = { ...prevState }
        const moduleNames = mutationName.split('/');

        // alter the state with the logic given in the store config
        if (moduleNames.length === 1) {
          originalFn(newState, ...args)
        } else {
          const moduleName = getStoreModuleName(mutationName);
          const moduleState = getStoreModule(newState, moduleName);
          originalFn(moduleState, ...args)
        }

        return newState
      })
    }
  })

  return values;
}

const handleGettersValuesSet = <T, >(store: StoreType, state: T, setGettersValues: Dispatch<SetStateAction<StateType>>) => {
  const getters = getStoreKeyModuleValues(store, 'getters');
  const getterNames = Object.keys(getters);
  if (!getterNames.length) return;

  getterNames.forEach(getterPath => {
    const moduleNames = getterPath.split('/');
    let originalFn;
    let value;

    // alter the state with the logic given in the store config
    if (moduleNames.length === 1) {
      originalFn = store.getters?.[getterPath] as GetterType;
      value = originalFn(state as StateType);
    } else {
      const moduleStore = getStoreModule(store, getterPath) as StateType;
      const moduleState = getStoreModule(state, getterPath) as StateType;
      const getterName = moduleNames[moduleNames.length - 1]
      originalFn = moduleStore.getters?.[getterName] as GetterType;
      value = originalFn(moduleState);
    }

    setGettersValues(prevValues => {
      if (!prevValues) prevValues = {}

      if (typeof prevValues[getterPath] === 'undefined') {
        prevValues[getterPath] = value;
      } else if (prevValues[getterPath] !== value) {
        return {
          ...prevValues,
          [getterPath]: value
        };
      }
      return prevValues;
    })
  });
}

const getStoreStateWithModules = <InheritedStateType, >(store: StoreType, result: Record<string, any> = {}): InheritedStateType => {
  Object.assign(result, store?.state);

  const childModules = Object.keys(store.modules ?? {});
  if (childModules.length) {
    Object.assign(result, { modules: {} });

    childModules.forEach(moduleName => {
      Object.assign(result.modules, { [moduleName]: {} });
      if (store.modules) getStoreStateWithModules(store.modules[moduleName], result.modules[moduleName]);
    })
  }

  return result as InheritedStateType;
}

export default withStore;
